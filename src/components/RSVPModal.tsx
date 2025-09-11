'use client';

import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import TicketConfirmation from './TicketConfirmation';
import { useEventStore, type Event } from '../store/eventStore';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  ticketId: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  quantity: number;
}

export default function RSVPModal({ isOpen, onClose, event, ticketId }: RSVPModalProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'confirmation'>('form');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    quantity: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  
  const { addToCart } = useEventStore();

  const ticket = event.tickets.find(t => t.id === ticketId);

  if (!ticket) return null;

  const totalPrice = ticket.price * formData.quantity;
  const isFirstStep = step === 'form';
  const isPaymentStep = step === 'payment';
  const isConfirmationStep = step === 'confirmation';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticket.price === 0) {
      handleFreeTicket();
    } else {
      setStep('payment');
    }
  };

  const handleFreeTicket = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate ticket code
    const code = `${event.id.toUpperCase().slice(0, 3)}${Date.now().toString().slice(-6)}`;
    setTicketCode(code);
    
    // Add to cart/storage
    addToCart({
      eventId: event.id,
      ticketId: ticket.id,
      quantity: formData.quantity,
      attendeeInfo: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
      },
    });

    setIsSubmitting(false);
    setStep('confirmation');
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate ticket code
    const code = `${event.id.toUpperCase().slice(0, 3)}${Date.now().toString().slice(-6)}`;
    setTicketCode(code);
    
    // Add to cart/storage
    addToCart({
      eventId: event.id,
      ticketId: ticket.id,
      quantity: formData.quantity,
      attendeeInfo: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
      },
    });

    setIsSubmitting(false);
    setStep('confirmation');
  };

  const resetModal = () => {
    setStep('form');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      quantity: 1,
    });
    setTicketCode('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {isConfirmationStep ? (
          <TicketConfirmation
            event={event}
            ticket={ticket}
            attendeeName={`${formData.firstName} ${formData.lastName}`}
            attendeeEmail={formData.email}
            quantity={formData.quantity}
            ticketCode={ticketCode}
            onClose={resetModal}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {isFirstStep ? 'Reserve Your Spot' : 'Payment Details'}
              </DialogTitle>
            </DialogHeader>

            {/* Ticket Summary */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{ticket.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{event.title}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {formData.quantity} ticket{formData.quantity !== 1 ? 's' : ''}
                  </span>
                  <span className="font-bold text-foreground">
                    {totalPrice === 0 ? 'Free' : `$${totalPrice}`}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Form or Payment */}
            {isFirstStep ? (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Number of Tickets</Label>
                  <Select
                    value={formData.quantity.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, quantity: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()} disabled={num > ticket.available}>
                          {num} {num > ticket.available ? '(Not available)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : ticket.price === 0 ? 'Reserve Spot' : 'Continue to Payment'}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Mock Payment Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        type="text"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        type="text"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Demo Mode:</strong> This is a simulated payment. No real charges will be made.
                  </AlertDescription>
                </Alert>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setStep('form')}
                    variant="secondary"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : `Pay $${totalPrice}`}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}