import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Location',
      content: 'Village Center, Main Street',
    },
    {
      icon: Clock,
      title: 'Hours',
      content: 'Open Daily: 8:00 AM - 8:00 PM',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: 'Available during business hours',
    },
    {
      icon: Mail,
      title: 'Services',
      content: 'Internet, Printing, Scanning, Online Forms',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Visit us or get in touch. We're here to help with all your internet and document needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <info.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">{info.title}</CardTitle>
                <CardDescription className="text-base">{info.content}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>About Our Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Our internet cafe is dedicated to serving the community with reliable internet access, 
              professional printing and scanning services, and expert assistance with online forms and applications.
            </p>
            <p>
              Whether you need to browse the web, print important documents, or get help with exam registrations 
              and government forms, our friendly staff is here to assist you every step of the way.
            </p>
            <p>
              We pride ourselves on being a trusted resource for our village community, providing affordable 
              and accessible digital services to everyone.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
