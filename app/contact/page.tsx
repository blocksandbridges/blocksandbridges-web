'use client';

import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import { envConfig } from "@/app/lib/constants";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: { preventDefault(): void; currentTarget: HTMLFormElement }) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!envConfig.emailjs.serviceId || !envConfig.emailjs.templateId
      || !envConfig.emailjs.userId) {
      Swal.fire({
        icon: 'error',
        title: 'Configuration error',
        text: 'Email service is not configured.',
      });
      return;
    }
    emailjs.sendForm(envConfig.emailjs.serviceId,
      envConfig.emailjs.templateId, form, {
        publicKey: envConfig.emailjs.userId,
      }).then(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent Successfully',
        });
        form.reset();
      },
      (error: { text?: string }) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops, something went wrong',
          text: error.text,
        });
      }
    );
  };

  return (
    <div className="bnb-content-page-root">
      <section className="bnb-hero-banner">
        <div className="container mx-auto relative z-10">
          <h1 className="bnb-hero-banner-title">Contact</h1>
        </div>
      </section>

      <section className="container mx-auto py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bnb-body-text">
            <h3 className="text-3xl font-bold text-bnb-orange">Our team is here for you!</h3>
            <p className="text-lg text-bnb-dark-blue mt-4">
              Email:{' '}
              <a
                href="mailto:info@blocksandbridges.ca"
                className="text-bnb-light-blue underline hover:text-bnb-dark-blue"
              >
                info@blocksandbridges.ca
              </a>
            </p>
          </div>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="from_name" className="bnb-form-label">
              <strong>Your Name</strong>
            </label>
            <input
              id="from_name"
              type="text"
              name="from_name"
              placeholder="Your Name"
              className="bnb-form-input"
            />
          </div>
          <div>
            <label htmlFor="from_email" className="bnb-form-label">
              <strong>Email Address</strong>
            </label>
            <input
              id="from_email"
              type="email"
              name="from_email"
              placeholder="Enter email"
              className="bnb-form-input"
            />
          </div>
          <div>
            <label htmlFor="subject" className="bnb-form-label">
              <strong>Subject</strong>
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              placeholder="Enter Subject"
              className="bnb-form-input"
            />
          </div>
          <div>
            <label htmlFor="message" className="bnb-form-label">
              <strong>Message</strong>
            </label>
            <textarea
              id="message"
              name="message"
              rows={10}
              className="bnb-form-input"
            />
          </div>
          <button type="submit" className="bnb-form-button">Submit</button>
          </form>
        </div>
      </section>
    </div>
  );
}
