import { useId, useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { Button } from '@/components/Button';

export function SignUpForm() {
  const [emailAddress, setEmailAddress] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [formStartTime, setFormStartTime] = useState(Date.now());
  const [honeypot, setHoneypot] = useState('');
  let id = useId();

  useEffect(() => {
    // Reset form start time whenever the form loads
    setFormStartTime(Date.now());

    // Populate JavaScript check hidden field
    const jsCheckField = document.getElementById('jsCheck');
    if (jsCheckField) {
      jsCheckField.value = 'passed';
    }
  }, []);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
      setErrorText('Spam detected. Please try again.');
      return;
    }

    // Time-based validation
    const timeElapsed = Date.now() - formStartTime;
    if (timeElapsed < 2000) {
      setErrorText('Form submission too fast. Please try again.');
      return;
    }

    // JavaScript check validation
    const jsCheckField = document.getElementById('jsCheck');
    if (!jsCheckField || jsCheckField.value !== 'passed') {
      setErrorText('Spam detected. Please try again.');
      return;
    }

    // Email validation
    if (!validateEmail(emailAddress)) {
      setErrorText('Invalid Email Address');
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
        name="user_phone"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ position: 'absolute', left: '-9999px' }}
        tabIndex="-1"
        autoComplete="off"
      />
      {/* JavaScript Check Hidden Field */}
      <input type="hidden" name="jsCheck" id="jsCheck" value="" />
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
