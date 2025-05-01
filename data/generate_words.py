import json
import requests
from time import sleep

def fetch_word_clue(word):
    """Fetch the definition/clue for a word using the Free Dictionary API"""
    try:
        response = requests.get(f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}")
        if response.status_code == 200:
            data = response.json()
            # Get the first definition from the first meaning of the first entry
            if isinstance(data, list) and len(data) > 0:
                first_entry = data[0]
                if 'meanings' in first_entry and len(first_entry['meanings']) > 0:
                    first_meaning = first_entry['meanings'][0]
                    if 'definitions' in first_meaning and len(first_meaning['definitions']) > 0:
                        return first_meaning['definitions'][0]['definition']
        return f"A term related to {word}"  # Fallback clue if no definition found
    except Exception as e:
        print(f"Error fetching clue for {word}: {e}")
        return f"A term related to {word}"  # Fallback clue if API fails

def generate_crossword_data(words_list):
    """Generate crossword data with clues for each word"""
    crossword_data = []
    for idx, word in enumerate(words_list, start=1):
        print(f"Processing {idx}/{len(words_list)}: {word}")
        clue = fetch_word_clue(word)
        crossword_data.append({
            "id": idx,
            "word": word,
            "clue": clue
        })
        sleep(1)  # Be nice to the API - add delay between requests
    return crossword_data

def main():
    # Load the original words list
    with open('wordsList.json', 'r') as f:
        words_list = json.load(f)
    
    # Generate crossword data with clues
    crossword_data = generate_crossword_data(words_list)
    
    # Save the new JSON file
    with open('crosswordData.json', 'w') as f:
        json.dump(crossword_data, f, indent=2)
    
    print("Crossword data generation complete!")

if __name__ == "__main__":
    main()