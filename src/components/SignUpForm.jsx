import { useId, useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { Button } from '@/components/Button';

export function SignUpForm() {
  const [emailAddress, setEmailAddress] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [formStartTime, setFormStartTime] = useState(Date.now()); // Track form start time
  const [honeypot, setHoneypot] = useState(''); // Honeypot field state
  let id = useId();

  useEffect(() => {
    // Reset form start time whenever the form loads
    setFormStartTime(Date.now());
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChangeEmail = (e) => {
    setEmailAddress(e.target.value);
    if (!!e.target.value && !validateEmail(e.target.value)) {
      setErrorText('Invalid Email Address');
    } else {
      setErrorText('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Honeypot validation
    if (honeypot) {
      console.log('Spam bot detected via honeypot!');
      return;
    }

    // Time-based validation
    const timeElapsed = Date.now() - formStartTime;
    if (timeElapsed < 2000) { // 2 seconds
      setErrorText('Form submission too fast. Please try again.');
      return;
    }

    if (!validateEmail(emailAddress)) {
      return;
    }

    const serviceID = 'service_9eddj4w';
    const templateID = 'template_4hdqwxt';
    const userID = 'njnJ53uqzX5AysTcD';

    emailjs
      .send(serviceID, templateID, { emailAddress }, userID)
      .then((response) => {
        setIsSent(true);
        setEmailAddress('A representative will contact you.');
        console.log('Email sent successfully!', response);
      })
      .catch((error) => {
        setErrorText('Error Sending Email');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="relative isolate mt-8 flex items-center pr-1">
      {/* Honeypot Field */}
      <input
        type="text"
        name="honeypot"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: 'none' }} // Hidden field
        tabIndex="-1"
        autoComplete="off"
      />
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <input
        required
        type="email"
        autoComplete="email"
        name="email"
        id={id}
        placeholder="Email Address"
        className="peer w-0 flex-auto bg-transparent px-4 py-2.5 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-[0.8125rem]/6"
        disabled={isSent}
        value={emailAddress}
        onChange={handleChangeEmail}
      />
      {!!errorText && (
        <span className="absolute left-2 bottom-[-28px] text-sm text-red-800">
          {errorText}
        </span>
      )}
      <Button type="submit" arrow={!isSent} disabled={isSent}>
        {isSent ? 'Thank You' : 'Get Access'}
      </Button>
      <div className="absolute inset-0 -z-10 rounded-lg transition peer-focus:ring-4 peer-focus:ring-sky-300/15" />
      <div className="absolute inset-0 -z-10 rounded-lg bg-white/2.5 ring-1 ring-white/15 transition peer-focus:ring-sky-300" />
    </form>
  );
}
