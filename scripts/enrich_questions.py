"""Build the standalone study bank from archived cards and authored explanations.

This build reads JSON only; no PDF, network, API key, or AI service is needed.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def read(path):
    return json.loads((ROOT / path).read_text(encoding='utf-8'))

def build():
    original = read('data/original-questions.json')
    edits = read('data/editorial-updates.json')
    explanations = {}
    for path in sorted((ROOT / 'data/explanations').glob('*.json')):
        entries = json.loads(path.read_text(encoding='utf-8'))
        assert not explanations.keys() & entries.keys(), f'Duplicate explanation in {path}'
        explanations.update(entries)
    assert len(original) == 526
    assert set(explanations) == {q['id'] for q in original}
    result = []
    for source in original:
        patch = edits.get(source['id'], {})
        question = {
            'id': source['id'],
            'question': patch.get('question', source['question']),
            'options': [{'key': o['key'], 'text': patch.get('optionEdits', {}).get(o['key'], o['text'])} for o in source['options']],
            'correct': patch.get('correct', source['correct']),
            'explanation': explanations[source['id']],
            'examEligible': patch.get('examEligible', True),
        }
        if 'reviewNote' in patch:
            question['reviewNote'] = patch['reviewNote']
        result.append(question)
    for index, alternate in enumerate(read('data/alternate-questions.json'), len(original) + 1):
        result.append({
            'id': str(index),
            'variantOf': alternate['variantOf'],
            'question': alternate['question'],
            'options': [{'key': chr(65 + i), 'text': text} for i, text in enumerate(alternate['choices'])],
            'correct': alternate['correct'],
            'explanation': alternate['explanation'],
            'examEligible': alternate.get('examEligible', True),
            **({'reviewNote': alternate['reviewNote']} if 'reviewNote' in alternate else {}),
        })
    assert len(result) == 555
    assert len({q['id'] for q in result}) == len(result)
    for question in result:
        keys = [o['key'] for o in question['options']]
        assert question['question'].strip() and len(question['explanation']) >= 100, question['id']
        assert len(keys) >= 2 and len(set(keys)) == len(keys), question['id']
        assert question['correct'] and set(question['correct']).issubset(keys), question['id']
        assert all(o['text'].strip() for o in question['options']), question['id']
        assert question['examEligible'] or len(question.get('reviewNote', '')) > 20, question['id']
    report = {
        'contentVersion': 2,
        'originalCount': len(original),
        'alternateCount': len(result) - len(original),
        'totalCount': len(result),
        'examEligibleCount': sum(q['examEligible'] for q in result),
        'reviewQuestionIds': [q['id'] for q in result if not q['examEligible']],
        'correctedAnswerIds': [key for key, value in edits.items() if 'correct' in value],
        'editorialChanges': edits,
    }
    (ROOT / 'src/data/questions.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    (ROOT / 'data/content-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    print(f"Built {len(result)} explained questions; {report['alternateCount']} alternate; {report['examEligibleCount']} eligible for exams.")

if __name__ == '__main__':
    build()
