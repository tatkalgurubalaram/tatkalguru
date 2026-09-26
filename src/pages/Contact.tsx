import React, { useEffect } from 'react';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { PageTransition } from '../components/PageTransition';
import { config } from '../config';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Contact: React.FC = () => {
  useEffect(() => {
    document.title = `Contact | ${config.brandName}`;
  }, []);

  return (
    <PageTransition>
      <PageContainer>
        <PageHeader 
          title="Contact Us"
          description="Have a question? Our support team will be available to help."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Contact' }
          ]}
        />
        <div style={{ maxWidth: '600px', marginTop: 'var(--space-8)' }}>
          <Card>
            <div className="flex" style={{ flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Input label="Name" placeholder="Your name" />
              <Input label="Email" placeholder="Your email address" type="email" />
              <div className="input-wrapper">
                <label className="input-label">Message</label>
                <textarea className="input-field" placeholder="How can we help?" style={{ minHeight: '120px', padding: '12px' }}></textarea>
              </div>
              <Button variant="primary">Send Message</Button>
            </div>
          </Card>
        </div>
      </PageContainer>
    </PageTransition>
  );
};
