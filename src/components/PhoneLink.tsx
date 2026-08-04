'use client';

import { trackPhoneClick } from '@/lib/adTracking';

type PhoneLinkProps = {
  phoneNumber: string;
  displayText?: string;
  className?: string;
};

export default function PhoneLink({ phoneNumber, displayText, className }: PhoneLinkProps) {
  return (
    <a
      href={`tel:${phoneNumber}`}
      className={className}
      onClick={() => trackPhoneClick()}
    >
      {displayText || phoneNumber}
    </a>
  );
}