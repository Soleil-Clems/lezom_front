import { describe, it, expect } from 'vitest';
import { ChannelTypeEnum, MessageTypeEnum } from '@/enums/enum';

describe('ChannelTypeEnum', () => {
  it('accepts "call"', () => {
    expect(ChannelTypeEnum.safeParse('call').success).toBe(true);
  });

  it('accepts "text"', () => {
    expect(ChannelTypeEnum.safeParse('text').success).toBe(true);
  });

  it('rejects invalid values', () => {
    expect(ChannelTypeEnum.safeParse('video').success).toBe(false);
    expect(ChannelTypeEnum.safeParse('').success).toBe(false);
    expect(ChannelTypeEnum.safeParse(123).success).toBe(false);
  });
});

describe('MessageTypeEnum', () => {
  const validTypes = ['img', 'text', 'file', 'pdf', 'system', 'gif', 'voice'];

  validTypes.forEach(type => {
    it(`accepts "${type}"`, () => {
      expect(MessageTypeEnum.safeParse(type).success).toBe(true);
    });
  });

  it('rejects invalid values', () => {
    expect(MessageTypeEnum.safeParse('video').success).toBe(false);
    expect(MessageTypeEnum.safeParse('').success).toBe(false);
    expect(MessageTypeEnum.safeParse(123).success).toBe(false);
  });
});
