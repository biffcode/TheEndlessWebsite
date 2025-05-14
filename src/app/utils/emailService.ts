import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
// You will need to create an account at https://www.emailjs.com/
// And set up an email service and templates
export const initEmailJS = () => {
  // Replace this with your actual EmailJS public key
  emailjs.init("YOUR_PUBLIC_KEY");
};

// Contact form email service
export const sendContactEmail = async (formData: any) => {
  try {
    const response = await emailjs.send(
      "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
      "YOUR_CONTACT_TEMPLATE_ID", // Replace with your template ID
      {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email,
      }
    );
    
    return { success: true, response };
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return { success: false, error };
  }
};

// Career application email service
export const sendCareerEmail = async (formData: any) => {
  try {
    const response = await emailjs.send(
      "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
      "YOUR_CAREER_TEMPLATE_ID", // Replace with your template ID
      {
        from_name: formData.name,
        from_email: formData.email,
        position: formData.position,
        message: formData.message,
        resume_name: formData.resume ? formData.resume.name : 'No resume attached',
        reply_to: formData.email,
      }
    );
    
    return { success: true, response };
  } catch (error) {
    console.error("Failed to send career application:", error);
    return { success: false, error };
  }
};

// Newsletter subscription email service
export const sendSubscriptionEmail = async (email: string) => {
  try {
    const response = await emailjs.send(
      "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
      "YOUR_NEWSLETTER_TEMPLATE_ID", // Replace with your template ID
      {
        subscriber_email: email,
        reply_to: email,
      }
    );
    
    return { success: true, response };
  } catch (error) {
    console.error("Failed to send subscription notification:", error);
    return { success: false, error };
  }
}; 