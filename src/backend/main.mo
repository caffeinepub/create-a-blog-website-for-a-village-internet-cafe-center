import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Blog Post Types
  public type BlogPost = {
    id : Nat;
    title : Text;
    slug : Text;
    content : Text;
    coverImageUrl : ?Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    isPublished : Bool;
  };

  module BlogPost {
    public func compare(a : BlogPost, b : BlogPost) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // Initialize Access Control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Storage
  var nextPostId = 1;
  let blogPosts = Map.empty<Nat, BlogPost>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var isInitialized = false;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin - Get All Blog Posts (Including Drafts)
  public query ({ caller }) func getAllPostsAdmin() : async [BlogPost] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins Only");
    };
    blogPosts.values().toArray();
  };

  // Public - Get Published Blog Posts
  public query func getPublishedPosts() : async [BlogPost] {
    blogPosts.values().toArray().filter(func(post : BlogPost) : Bool { post.isPublished });
  };

  // Admin - Create New Blog Post
  public shared ({ caller }) func createPost(title : Text, slug : Text, content : Text, coverImageUrl : ?Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins Only");
    };

    let postId = nextPostId;
    nextPostId += 1;

    let newPost : BlogPost = {
      id = postId;
      title;
      slug;
      content;
      coverImageUrl;
      createdAt = Time.now();
      updatedAt = Time.now();
      isPublished = false;
    };

    blogPosts.add(postId, newPost);
    postId;
  };

  // Admin - Update Existing Blog Post
  public shared ({ caller }) func updatePost(postId : Nat, title : Text, slug : Text, content : Text, coverImageUrl : ?Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins Only");
    };

    switch (blogPosts.get(postId)) {
      case (null) { Runtime.trap("Post Not Found") };
      case (?existingPost) {
        let updatedPost : BlogPost = {
          id = postId;
          title;
          slug;
          content;
          coverImageUrl;
          createdAt = existingPost.createdAt;
          updatedAt = Time.now();
          isPublished = existingPost.isPublished;
        };
        blogPosts.add(postId, updatedPost);
      };
    };
  };

  // Admin - Toggle Publish Status
  public shared ({ caller }) func togglePublishStatus(postId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins Only");
    };

    switch (blogPosts.get(postId)) {
      case (null) { Runtime.trap("Post Not Found") };
      case (?existingPost) {
        let updatedPost : BlogPost = {
          id = postId;
          title = existingPost.title;
          slug = existingPost.slug;
          content = existingPost.content;
          coverImageUrl = existingPost.coverImageUrl;
          createdAt = existingPost.createdAt;
          updatedAt = Time.now();
          isPublished = not existingPost.isPublished;
        };
        blogPosts.add(postId, updatedPost);
      };
    };
  };

  // Initialize with Seed Posts on first run
  func initializeSeedPosts() {
    if (not isInitialized) {
      let initialPosts : [(Nat, BlogPost)] = [
        (
          1,
          {
            id = 1;
            title = "Welcome to Your Village Internet Cafe!";
            slug = "welcome";
            content = "Discover all our services, from internet access to printing, scanning, and online forms assistance.";
            coverImageUrl = null;
            createdAt = Time.now();
            updatedAt = Time.now();
            isPublished = true;
          },
        ),
        (
          2,
          {
            id = 2;
            title = "Printing & Scanning Made Easy";
            slug = "printing-scanning";
            content = "High-quality printing and efficient scanning services available. Bring your documents and leave the rest to us!";
            coverImageUrl = null;
            createdAt = Time.now();
            updatedAt = Time.now();
            isPublished = true;
          },
        ),
        (
          3,
          {
            id = 3;
            title = "Online Forms & Applications Support";
            slug = "online-forms";
            content = "Need help with online exam registration or government forms? Our experts are here to guide you through every step.";
            coverImageUrl = null;
            createdAt = Time.now();
            updatedAt = Time.now();
            isPublished = true;
          },
        ),
      ];

      for ((id, post) in initialPosts.vals()) {
        blogPosts.add(id, post);
      };

      nextPostId := 4;
      isInitialized := true;
    };
  };

  // Initialize seed posts on canister initialization
  initializeSeedPosts();
};
