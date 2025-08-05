'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
}

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Premium glassmorphic contact form with luxury styling
 * Features floating labels, validation, and smooth animations
 */
const ContactForm: React.FC = () => {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll show success
      // In production, integrate with email service or API
      setStatus('sent');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          message: ''
        });
        setStatus('idle');
      }, 3000);
      
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (status === 'sent') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-white/10 backdrop-blur-luxury rounded-2xl border border-white/20"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
        <p className="text-white/80">Your message has been sent successfully. We'll be in touch soon.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full max-w-lg mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="relative group">
            <FloatingInput
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              label="Full Name"
              required
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <FloatingInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              label="Email Address"
              required
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          </motion.div>
        </div>

        {/* Company and Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="relative group">
            <FloatingInput
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleInputChange}
              label="Company Name"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <FloatingInput
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              label="Phone Number"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
            />
          </motion.div>
        </div>

        {/* Message Field */}
        <motion.div variants={itemVariants} className="relative group">
          <FloatingTextArea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            label="Your Message"
            required
            rows={5}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            type="submit"
            disabled={status === 'sending'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
              status === 'sending'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-millo-red to-millo-blue hover:from-millo-blue hover:to-millo-red text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {status === 'sending' ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Sending...</span>
              </div>
            ) : (
              'Send Message'
            )}
          </motion.button>
        </motion.div>

        {/* Error State */}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200"
          >
            Something went wrong. Please try again.
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

interface FloatingInputProps {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  id,
  name,
  type,
  value,
  onChange,
  label,
  required = false,
  icon
}) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 z-10">
        {icon}
      </div>
      
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-millo-gold/50 focus:border-millo-gold/50 transition-all duration-300 peer"
        placeholder={label}
      />
      
      <label
        htmlFor={id}
        className={`absolute left-12 transition-all duration-300 pointer-events-none ${
          value
            ? 'top-2 text-xs text-millo-gold'
            : 'top-1/2 transform -translate-y-1/2 text-white/70 peer-focus:top-2 peer-focus:text-xs peer-focus:text-millo-gold'
        }`}
      >
        {label}
      </label>
    </div>
  );
};

interface FloatingTextAreaProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  required?: boolean;
  rows?: number;
  icon?: React.ReactNode;
}

const FloatingTextArea: React.FC<FloatingTextAreaProps> = ({
  id,
  name,
  value,
  onChange,
  label,
  required = false,
  rows = 4,
  icon
}) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-4 text-white/50 z-10">
        {icon}
      </div>
      
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-millo-gold/50 focus:border-millo-gold/50 transition-all duration-300 resize-none peer"
        placeholder={label}
      />
      
      <label
        htmlFor={id}
        className={`absolute left-12 transition-all duration-300 pointer-events-none ${
          value
            ? 'top-2 text-xs text-millo-gold'
            : 'top-4 text-white/70 peer-focus:top-2 peer-focus:text-xs peer-focus:text-millo-gold'
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default ContactForm;
