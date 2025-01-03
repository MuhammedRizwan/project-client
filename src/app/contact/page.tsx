'use client'
import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Textarea } from '@nextui-org/react';

const ContactPage = () => {
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-500 mb-4">HEAVEN FINDER</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {`Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.`}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Information Cards */}
          <Card className="p-6 text-center bg-white text-black">
            <CardBody>
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <MapPin className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg">Our Location</h3>
                <p className="text-gray-600">123 street,maradu,kochi</p>
              </div>
            </CardBody>
          </Card>

          <Card className="p-6 text-center bg-white text-black">
            <CardBody>
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Phone className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg">Phone Number</h3>
                <p className="text-gray-600">+91 1234567890</p>
              </div>
            </CardBody>
          </Card>

          <Card className="p-6 text-center bg-white text-black">
            <CardBody>
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Mail className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg">Email Address</h3>
                <p className="text-gray-600">contact@heavenfinder.com</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="mt-12 max-w-2xl mx-auto bg-white text-black">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-center">Send us a Message</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">First Name</label>
                  <Input 
                    placeholder="Enter your first name"
                    className="w-full"
                    classNames={{
                      input: "text-black placeholder:text-gray-400",
                      inputWrapper: "border-gray-300"
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Last Name</label>
                  <Input 
                    placeholder="Enter your last name"
                    className="w-full"
                    classNames={{
                      input: "text-black placeholder:text-gray-400",
                      inputWrapper: "border-gray-300"
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
                <Input 
                  type="email"
                  placeholder="Enter your email"
                  className="w-full"
                  classNames={{
                    input: "text-black placeholder:text-gray-400",
                    inputWrapper: "border-gray-300"
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Message</label>
                <Textarea 
                  placeholder="Type your message here..."
                  className="w-full min-h-[120px]"
                  classNames={{
                    input: "text-black placeholder:text-gray-400",
                    inputWrapper: "border-gray-300"
                  }}
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Send Message
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;

