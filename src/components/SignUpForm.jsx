import { useId, useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { Button } from '@/components/Button';

export function SignUpForm() {
  const [emailAddress, setEmailAddress] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [formStartTime, setFormStartTime] = useState(Date.now());
  const [honeypot, setHoneypot] = useState('');
  const [jsCheckValue, setJsCheckValue] = useState(''); // JavaScript check via state
  const [isLinux, setIsLinux] = useState(false); // Platform restriction state
  let id = useId();

  useEffect(() => {
    console.log('useEffect executed'); // Debugging
    setFormStartTime(Date.now());
    setJsCheckValue('passed'); // Set JavaScript check
    console.log('JavaScript check set via state: passed'); // Debugging

    // Detect if the user is on Linux
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();
    const linuxDetected = platform.includes('linux') || userAgent.includes('linux');
    setIsLinux(linuxDetected);
    console.log('Is Linux user:', linuxDetected); // Debugging
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

    // Restrict Linux users
    if (isLinux) {
      setErrorText('Access denied. Linux users are restricted.');
      console.log('Blocked Linux user attempt'); // Debugging
      return;
    }

    // Honeypot validation
    console.log('Honeypot value:', honeypot); // Debugging
    if (honeypot) {
      setErrorText('Spam detected. Please try again.');
      return;
    }

    // Time-based validation
    const timeElapsed = Date.now() - formStartTime;
    console.log('Time elapsed since form load:', timeElapsed); // Debugging
    if (timeElapsed < 2000) {
      setErrorText('Form submission too fast. Please try again.');
      return;
    }

    console.log('JavaScript check value via state:', jsCheckValue); // Debugging
    if (jsCheckValue !== 'passed') {
      setErrorText('Spam detected. Please try again.');
      return;
    }

    if (!validateEmail(emailAddress)) {
      setErrorText('Invalid Email Address');
      return;
    }

    console.log('All validations passed!'); // Debugging

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
        console.error('Error sending email:', error); // Debugging
        setErrorText('Error Sending Email');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="relative isolate mt-8 flex items-center pr-1">
      {/* Honeypot Field */}
      <input
        type="text"
        name="user_phone_hidden"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
        tabIndex="-1"
        autoComplete="off"
      />
      {/* JavaScript Check Hidden Field */}
      <input type="hidden" name="jsCheck" id="jsCheck" value={jsCheckValue} />
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
