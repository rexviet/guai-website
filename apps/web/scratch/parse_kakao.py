import sys
from bs4 import BeautifulSoup
import urllib.parse

def main():
    with open('../kakao_home.html', 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 1. Extract head
    head = soup.find('head')
    with open('scratch/head.html', 'w', encoding='utf-8') as f:
        f.write(head.prettify())
        
    # 2. Extract Header (nav)
    nav = soup.find('div', class_='main-header')
    with open('scratch/header.html', 'w', encoding='utf-8') as f:
        f.write(nav.prettify())
        
    # 3. Extract Footer
    footer = soup.find('div', class_='footer-con')
    with open('scratch/footer.html', 'w', encoding='utf-8') as f:
        f.write(footer.prettify())
        
    # 4. Extract Main Content (Banner + Services + Works)
    # We want home-1-section, #Our-Benefits, #recent-work
    home_1 = soup.find('div', class_='home-1-section')
    benefits = soup.find('section', id='Our-Benefits')
    recent_work = soup.find('section', id='recent-work')
    
    with open('scratch/main.html', 'w', encoding='utf-8') as f:
        if home_1: f.write(home_1.prettify())
        if benefits: f.write(benefits.prettify())
        if recent_work: f.write(recent_work.prettify())
        
    # 5. Extract scripts at the bottom
    body = soup.find('body')
    scripts = body.find_all('script', recursive=False)
    with open('scratch/scripts.html', 'w', encoding='utf-8') as f:
        for s in scripts:
            f.write(str(s) + "\n")
            
    print("Extraction done!")

if __name__ == '__main__':
    main()
