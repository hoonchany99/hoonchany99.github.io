/** 가이드 구역 라벨·제목 규칙 시험. `npm run test-term-guide` */
import test from 'node:test';
import assert from 'node:assert/strict';
import { guideKind, isTreatmentCategory, guideLabel, guideTitle, GUIDE_KIND_BY_CATEGORY } from '../src/lib/termGuide.ts';

test('분야 → 종류', () => {
  for (const c of ['보철·심미', '임플란트', '교정·교합', '발치·수술', '충치·신경']) assert.equal(guideKind(c), 'treatment', c);
  for (const c of ['잇몸', '입안 증상·질환', '턱관절·이갈이']) assert.equal(guideKind(c), 'condition', c);
  for (const c of ['검사·재료', '치아 구조', '전신 건강·특수 환자', '모르는 분야', undefined, null, '']) assert.equal(guideKind(c as string), 'concept', String(c));
  assert.equal(isTreatmentCategory('임플란트'), true);
  assert.equal(isTreatmentCategory('잇몸'), false);
  assert.equal(Object.keys(GUIDE_KIND_BY_CATEGORY).length, 11);
});

test('라벨', () => {
  assert.equal(guideLabel('임플란트'), '치료 선택 가이드');
  assert.equal(guideLabel('잇몸'), '진료 가이드');
  assert.equal(guideLabel('치아 구조'), '이해 가이드');
  assert.equal(guideLabel(undefined), '이해 가이드');
});

test('제목 세 종류', () => {
  assert.equal(guideTitle('임플란트', '임플란트'), '임플란트 선택 전 확인할 3가지');
  assert.equal(guideTitle('치은염', '잇몸'), '치은염 상담 전 확인할 3가지');
  assert.equal(guideTitle('어금니', '치아 구조'), '어금니, 진료에서 확인할 3가지');
});

test('제목: 20자 넘으면 줄임, 20자는 그대로', () => {
  assert.equal(guideTitle('상악동 거상술 합병증', '임플란트'), '상악동 거상술 합병증, 확인할 3가지');
  assert.equal(guideTitle('심혈관 환자 치과', '전신 건강·특수 환자'), '심혈관 환자 치과, 확인할 3가지');
  const t = guideTitle('가나다라마바사', '교정·교합'); // 「가나다라마바사 선택 전 확인할 3가지」 = 20자
  assert.equal(t, '가나다라마바사 선택 전 확인할 3가지');
  assert.equal(t.length, 20);
});

test('의료법 56조: 병원 기준·상담 신청 문구 없음', () => {
  for (const c of ['임플란트', '잇몸', '치아 구조']) assert.doesNotMatch(guideLabel(c) + guideTitle('이름', c), /우리 병원|상담 신청|예약/);
});
