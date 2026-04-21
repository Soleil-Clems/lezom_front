import { describe, it, expect } from 'vitest';
import { ChannelTypeEnum, MessageTypeEnum } from '@/enums/enum';

describe('ChannelTypeEnum', () => {
  it('accepte "call"', () => {
    expect(ChannelTypeEnum.parse('call')).toBe('call');
  });

  it('accepte "text"', () => {
    expect(ChannelTypeEnum.parse('text')).toBe('text');
  });

  it('rejette une valeur inconnue', () => {
    expect(() => ChannelTypeEnum.parse('video')).toThrow();
  });
});

describe('MessageTypeEnum', () => {
  const validValues = ['img', 'text', 'file', 'pdf', 'system', 'gif', 'voice'];

  validValues.forEach((v) => {
    it(`accepte "${v}"`, () => {
      expect(MessageTypeEnum.parse(v)).toBe(v);
    });
  });

  it('rejette une valeur inconnue', () => {
    expect(() => MessageTypeEnum.parse('audio')).toThrow();
  });
});
