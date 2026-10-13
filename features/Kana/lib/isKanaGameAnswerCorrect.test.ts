import { describe, expect, it } from 'vitest';
import { isKanaGameAnswerCorrect } from './isKanaGameAnswerCorrect';
import { flattenKanaGroups } from './flattenKanaGroup';
import { kana } from '../data/kana';

const shi = { kana: 'し', romaji: 'shi', altRomanji: ['si'] };
const a = { kana: 'あ', romaji: 'a', altRomanji: [] };
const dzi = { kana: 'ぢ', romaji: 'ji', altRomanji: ['di'] };
const dzu = { kana: 'づ', romaji: 'zu', altRomanji: ['du'] };

describe('isKanaGameAnswerCorrect', () => {
  it('accepts the primary romaji (case- and whitespace-insensitive)', () => {
    expect(isKanaGameAnswerCorrect(shi, 'shi', false)).toBe(true);
    expect(isKanaGameAnswerCorrect(shi, 'SHI', false)).toBe(true);
    expect(isKanaGameAnswerCorrect(shi, ' shi ', false)).toBe(true);
    expect(isKanaGameAnswerCorrect(shi, 's h i', false)).toBe(true);
  });

  it('accepts alternative romanizations in normal mode', () => {
    // Regression: Blitz/Gauntlet previously only accepted the primary romaji,
    // so "si" for し was wrongly marked incorrect while the main Type mode
    // accepted it.
    expect(isKanaGameAnswerCorrect(shi, 'si', false)).toBe(true);
    expect(isKanaGameAnswerCorrect(shi, 'SI', false)).toBe(true);
  });

  it('accepts di/du romanizations for ぢ and づ', () => {
    // Regression #29312: 'di' is the standard keystroke for ぢ and 'du' for づ.
    expect(isKanaGameAnswerCorrect(dzi, 'di', false)).toBe(true);
    expect(isKanaGameAnswerCorrect(dzi, 'ji', false)).toBe(true);
    expect(isKanaGameAnswerCorrect(dzu, 'du', false)).toBe(true);
    expect(isKanaGameAnswerCorrect(dzu, 'zu', false)).toBe(true);
  });

  it('accepts alternative yoon spellings from the kana data', () => {
    const jyIndex = kana.findIndex(group => group.groupName === 'h.y.jy');
    const [ja] = flattenKanaGroups([jyIndex]);
    expect(isKanaGameAnswerCorrect(ja, 'jya', false)).toBe(true);
    expect(isKanaGameAnswerCorrect(ja, 'zya', false)).toBe(true);
    expect(isKanaGameAnswerCorrect(ja, 'zy', false)).toBe(false);

    const chyIndex = kana.findIndex(group => group.groupName === 'h.y.chy');
    const [cha] = flattenKanaGroups([chyIndex]);
    expect(isKanaGameAnswerCorrect(cha, 'tya', false)).toBe(true);
    expect(isKanaGameAnswerCorrect(cha, 'cya', false)).toBe(true);
  });

  it('rejects an incorrect romaji', () => {
    expect(isKanaGameAnswerCorrect(shi, 'su', false)).toBe(false);
    expect(isKanaGameAnswerCorrect(a, 'si', false)).toBe(false);
  });

  it('matches the kana character itself in reverse mode', () => {
    expect(isKanaGameAnswerCorrect(shi, 'し', true)).toBe(true);
    expect(isKanaGameAnswerCorrect(shi, ' し ', true)).toBe(true);
    expect(isKanaGameAnswerCorrect(shi, 'shi', true)).toBe(false);
  });
});
