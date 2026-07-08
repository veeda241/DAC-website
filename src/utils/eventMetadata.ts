import { normalizeEventDate } from './eventDates';

export const END_DATE_DELIMITER = '\n\n||END:';
export const REG_LINK_DELIMITER = '\n\n||REGISTER:';

export interface ParsedEventMetadata {
  description: string;
  endDate?: string;
  registrationLink?: string;
}

export function parseEventMetadata(
  rawDescription: string,
  fallbackRegistrationLink?: string
): ParsedEventMetadata {
  let description = rawDescription || '';
  let endDate = '';
  let registrationLink = fallbackRegistrationLink || '';

  if (description.includes(REG_LINK_DELIMITER)) {
    const [descPart, linkPart] = description.split(REG_LINK_DELIMITER);
    description = descPart;
    registrationLink = linkPart?.trim() || registrationLink;
  }

  if (description.includes(END_DATE_DELIMITER)) {
    const [descPart, endPart] = description.split(END_DATE_DELIMITER);
    description = descPart;
    endDate = normalizeEventDate(endPart?.trim().split('\n')[0] || '');
  }

  return {
    description: description.trim(),
    endDate: endDate || undefined,
    registrationLink: registrationLink || undefined,
  };
}

export function serializeEventDescription(
  description: string,
  endDate?: string,
  registrationLink?: string
): string {
  let result = description.trim();

  if (endDate) {
    result += `${END_DATE_DELIMITER}${normalizeEventDate(endDate)}`;
  }

  if (registrationLink?.trim()) {
    result += `${REG_LINK_DELIMITER}${registrationLink.trim()}`;
  }

  return result;
}
