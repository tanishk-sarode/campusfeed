def basic_classify(text: str) -> dict:
    t = text.lower()
    if any(k in t for k in ['lost', 'found', 'wallet', 'phone', 'keys', 'bag']):
        return {
            'type': 'lost_found',
            'confidence': 0.9,
            'extractedData': {
                'type': 'lost_found',
                'title': text.split('.')[0] if text else 'Lost & Found',
                'description': text,
                'itemType': 'found' if 'found' in t else 'lost'
            }
        }
    if any(k in t for k in ['workshop', 'event', 'meet', 'seminar', 'pm', 'am', 'tomorrow', 'today']):
        return {
            'type': 'event',
            'confidence': 0.85,
            'extractedData': {
                'type': 'event',
                'title': text.split('.')[0] if text else 'Event',
                'description': text
            }
        }
    return {
        'type': 'announcement',
        'confidence': 0.6,
        'extractedData': {
            'type': 'announcement',
            'title': text.split('.')[0] if text else 'Announcement',
            'description': text
        }
    }
