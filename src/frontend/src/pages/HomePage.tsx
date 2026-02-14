import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, Globe, FileText, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const services = [
    {
      icon: Globe,
      title: 'Internet Access',
      description: 'High-speed internet connectivity for browsing, research, and communication.',
    },
    {
      icon: Printer,
      title: 'Printing & Scanning',
      description: 'Professional printing and scanning services for all your document needs.',
    },
    {
      icon: FileText,
      title: 'Online Forms Support',
      description: 'Expert assistance with online applications, exam registrations, and government forms.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Welcome to Your Village Internet Cafe
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Your trusted partner for internet services, printing, scanning, and online assistance in the heart of our village.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/blog">
                  <Button size="lg" className="gap-2">
                    Read Our Blog
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/cafe-hero.dim_1600x600.png"
                alt="Village Internet Cafe"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer a wide range of services to meet all your digital needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Visit Us Today
              </h2>
              <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
                Stop by our cafe for all your internet and document needs. Our friendly staff is here to help!
              </p>
              <Link to="/contact">
                <Button size="lg" variant="secondary">
                  Get Directions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
