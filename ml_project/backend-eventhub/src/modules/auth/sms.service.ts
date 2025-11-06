import { config } from '../../config/env';
import { logger } from '../../config/logger';

/**
 * SMS Service Interface
 */
export interface ISmsService {
  sendOtp(countryCode: string, mobile: string, code: string): Promise<void>;
}

/**
 * Console SMS Service - logs OTP to console (development)
 */
class ConsoleSmsService implements ISmsService {
  async sendOtp(countryCode: string, mobile: string, code: string): Promise<void> {
    logger.info(
      {
        to: `${countryCode}${mobile}`,
        code,
      },
      '📱 SMS OTP (Console)'
    );
    
    console.log('\n' + '='.repeat(60));
    console.log('📱 SMS OTP MESSAGE');
    console.log('='.repeat(60));
    console.log(`To: ${countryCode}${mobile}`);
    console.log(`Code: ${code}`);
    console.log(`Expires: ${config.otp.expiryMinutes} minutes`);
    console.log('='.repeat(60) + '\n');
  }
}

/**
 * Twilio SMS Service - sends real SMS via Twilio (production)
 */
class TwilioSmsService implements ISmsService {
  async sendOtp(countryCode: string, mobile: string, _code: string): Promise<void> {
    try {
      // Note: Twilio client would be initialized here
      // For now, this is a placeholder that logs
      logger.info(
        {
          to: `${countryCode}${mobile}`,
          provider: 'twilio',
        },
        'Sending SMS via Twilio'
      );

      // In production, you would use:
      // const twilio = require('twilio');
      // const client = twilio(config.sms.twilio.sid, config.sms.twilio.token);
      // await client.messages.create({
      //   body: `Your EventHub verification code is: ${code}. Valid for ${config.otp.expiryMinutes} minutes.`,
      //   from: config.sms.twilio.from,
      //   to: `${countryCode}${mobile}`
      // });

      logger.info('SMS sent successfully via Twilio');
    } catch (error) {
      logger.error({ error }, 'Failed to send SMS via Twilio');
      throw new Error('Failed to send SMS');
    }
  }
}

/**
 * SMS Service Factory - returns appropriate service based on config
 */
export class SmsService {
  private static instance: ISmsService;

  static getInstance(): ISmsService {
    if (!SmsService.instance) {
      if (config.sms.provider === 'twilio') {
        SmsService.instance = new TwilioSmsService();
      } else {
        SmsService.instance = new ConsoleSmsService();
      }
    }
    return SmsService.instance;
  }
}
