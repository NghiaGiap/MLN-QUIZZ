"""Usage: python scripts/extract_questions.py source.pdf (requires pymupdf)."""
import bisect
import json
import re
import sys
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[1]

def extract(source):
    document = fitz.open(source)
    fragments, anchors = [], []
    for page_no, page in enumerate(document, 1):
        for block in page.get_text('dict')['blocks']:
            for line in block.get('lines', []):
                x, y = line['bbox'][:2]
                text = ''.join(span['text'] for span in line['spans']).strip()
                if not text or (page_no == 1 and y < 220):
                    continue
                position = (page_no - 1) * 792 + y
                fragments.append((position, page_no, x, text))
                answer = re.match(r'^([A-Ea-e]+)(?:\s*\(|\s*$)', text)
                if 270 < x < 280 and 'Tahoma' in line['spans'][0]['font'] and answer:
                    anchors.append((position, page_no, answer[1].upper()))
    anchors.sort()
    positions = [a[0] - 1.5 for a in anchors]
    records = [{'page': a[1], 'key': a[2], 'questionFragments': [], 'answerFragments': []} for a in anchors]
    for position, page, x, text in fragments:
        index = bisect.bisect_right(positions, position) - 1
        if index >= 0:
            side = 'questionFragments' if x < 270 else 'answerFragments'
            records[index][side].append((position, x, text))
    def render(parts):
        lines = []
        for position, x, text in sorted(parts):
            if not lines or abs(lines[-1][0] - position) > 2:
                lines.append([position, []])
            lines[-1][1].append((x, text))
        return '\n'.join(' '.join(text for _, text in sorted(line[1])) for line in lines)
    return [{'page': r['page'], 'key': r['key'], 'rawQuestion': render(r['questionFragments']), 'rawAnswer': render(r['answerFragments'])} for r in records]

def clean(text):
    text = text.replace('\u200b', '')
    text = re.sub(r'\(\s*NHUNG\s+HOÀNG\s*\)', '', text, flags=re.I)
    return re.sub(r'\s+', ' ', text).strip()

def parse(records):
    bank = []
    for index, record in enumerate(records, 1):
        matches = list(re.finditer(r'(?m)^([A-Ea-e])[.)]\s*', record['rawQuestion']))
        first_option = next((i for i, match in enumerate(matches) if match[1].upper() == 'A'), len(matches))
        matches = matches[first_option:]
        options = [{'key': m[1].upper(), 'text': clean(record['rawQuestion'][m.end():matches[i + 1].start() if i + 1 < len(matches) else None])} for i, m in enumerate(matches)]
        question = clean(record['rawQuestion'][:matches[0].start()]) if matches else record['rawQuestion']
        bank.append({'id': str(index), 'question': question, 'options': options, 'correct': list(record['key']), 'note': clean(record['rawAnswer'][len(record['key']):]), 'page': record['page']})
    return bank

if __name__ == '__main__':
    records = extract(sys.argv[1])
    bank = parse(records)
    (ROOT / 'data').mkdir(exist_ok=True)
    (ROOT / 'src/data').mkdir(parents=True, exist_ok=True)
    (ROOT / 'data/extracted-raw.json').write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')
    (ROOT / 'src/data/questions.json').write_text(json.dumps(bank, ensure_ascii=False, indent=2), encoding='utf-8')
    print('Cards:', len(bank))
    for question in bank:
        keys = [o['key'] for o in question['options']]
        if len(keys) < 2 or len(set(keys)) != len(keys) or not set(question['correct']).issubset(keys):
            print('REVIEW', json.dumps(question, ensure_ascii=False))
