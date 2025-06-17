#!/bin/bash

# 🗼 Panopticron Terminal Slide Presenter
# Navigate with: n (next), p (previous), q (quit), r (restart)

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Current slide number
current_slide=1
total_slides=7

# Function to clear screen and show header
show_header() {
    clear
    echo -e "${BOLD}${BLUE}=================================================${NC}"
    echo -e "${BOLD}${WHITE}🗼 PANOPTICRON: Kijk uit! Overzicht behouden${NC}"
    echo -e "${BOLD}${GRAY}Slide $current_slide/$total_slides${NC}"
    echo -e "${BOLD}${BLUE}=================================================${NC}"
    echo ""
}

# Function to show navigation help
show_nav() {
    echo ""
    echo -e "${GRAY}Navigation: ${GREEN}[n]${NC}ext ${GREEN}[p]${NC}rev ${GREEN}[r]${NC}estart ${GREEN}[q]${NC}uit${NC}"
}

# Slide content functions
slide_1() {
    show_header
    echo -e "${BOLD}${RED}🏢 Het Probleem${NC}"
    echo -e "${YELLOW}2 min - Opening Hook${NC}"
    echo ""
    echo -e "• 🎯 Stel je voor... digitale studio, veel projecten"
    echo -e "• 📈 Business is good!"
    echo -e "• 🌪️  Maar... chaos en verwarring"
    echo -e "• ⏰ Tijdverlies = Bad for business!"
    echo ""
    echo -e "${CYAN}→ Switch to /landing-page demo${NC}"
}

slide_2() {
    show_header
    echo -e "${BOLD}${GREEN}🗼 De Oplossing${NC}"
    echo -e "${YELLOW}3 min - Watchtower Metaphor${NC}"
    echo ""
    echo -e "• 🌲 Bomen kappen → React framework bouwen"
    echo -e "• 🏗️  Geraamte maken → Platform structure"
    echo -e "• 🔍 Verrekijker → Details zien"
    echo -e "• 💡 Lantaarn → Verhelderende inzichten"
    echo ""
    echo -e "${CYAN}→ \"We zijn digital natives, dus...\"${NC}"
}

slide_3() {
    show_header
    echo -e "${BOLD}${PURPLE}🔍 De Verrekijker${NC}"
    echo -e "${YELLOW}3 min - Component Showcase${NC}"
    echo ""
    echo -e "• 🎨 Layout structuren (kaders, menu's)"
    echo -e "• 🌈 Kleurrijke badges"
    echo -e "• 📱 Uitklapvensters"
    echo -e "• ✨ Interactiviteit & animaties"
    echo ""
    echo -e "${CYAN}→ Switch to /showcase demo${NC}"
}

slide_4() {
    show_header
    echo -e "${BOLD}${YELLOW}💡 De Lantaarn${NC}"
    echo -e "${YELLOW}2 min - UX Experiments${NC}"
    echo ""
    echo -e "• 🧪 UX iteraties"
    echo -e "• 🎭 User feedback loops"
    echo -e "• 🔄 Experimentele features"
    echo -e "• 🛤️  Pad verlichten voor gebruikers"
    echo ""
    echo -e "${CYAN}→ Switch to /experiments demo${NC}"
}

slide_5() {
    show_header
    echo -e "${BOLD}${RED}🏗️ Het Platform${NC}"
    echo -e "${YELLOW}8 min - Main Dashboard Demo${NC}"
    echo ""
    echo -e "• ⚡ Priority systeem (laag = urgent)"
    echo -e "• 🎛️  Manual override (TechFlow verhaal)"
    echo -e "• 👁️  GitHub + Vercel integratie"
    echo -e "• 📈 Lifeline charts (historische trends)"
    echo ""
    echo -e "${BOLD}${RED}→ Switch to /dashboard demo (MAIN EVENT)${NC}"
}

slide_6() {
    show_header
    echo -e "${BOLD}${CYAN}🌅 Het Panorama${NC}"
    echo -e "${YELLOW}2 min - Full View${NC}"
    echo ""
    echo -e "• 📋 Project management (/projects)"
    echo -e "• 🔧 System health (/status)"
    echo -e "• 👀 Complete zichtbaarheid"
    echo -e "• 🎯 Nooit meer belangen uit het oog"
    echo ""
    echo -e "${CYAN}→ Switch to /projects + /status demo${NC}"
}

slide_7() {
    show_header
    echo -e "${BOLD}${GREEN}🔮 De Horizon${NC}"
    echo -e "${YELLOW}1 min - Closing${NC}"
    echo ""
    echo -e "• ✅ Panorama bereikt"
    echo -e "• 🗼 Virtuele uitkijktoren werkend"
    echo -e "• 🚀 Zoeken naar volgende uitdaging"
    echo -e "• 💪 Overzicht behouden = missie geslaagd"
    echo ""
    echo -e "${CYAN}→ Questions & wrap-up${NC}"
}

# Function to show current slide
show_slide() {
    case $current_slide in
        1) slide_1 ;;
        2) slide_2 ;;
        3) slide_3 ;;
        4) slide_4 ;;
        5) slide_5 ;;
        6) slide_6 ;;
        7) slide_7 ;;
        *) slide_1 ;;
    esac
}

# Main presentation loop
main() {
    echo -e "${BOLD}${GREEN}🗼 Panopticron Terminal Slide Presenter${NC}"
    echo -e "${GRAY}Press any key to start...${NC}"
    read -n 1 -s

    show_slide

    while true; do
        read -n 1 -s key
        case $key in
            'n'|'N'|' '|$'\n') # Next slide
                if [ $current_slide -lt $total_slides ]; then
                    ((current_slide++))
                    show_slide
                fi
                ;;
            'p'|'P') # Previous slide
                if [ $current_slide -gt 1 ]; then
                    ((current_slide--))
                    show_slide
                fi
                ;;
            'r'|'R') # Restart
                current_slide=1
                show_slide
                ;;
            'q'|'Q'|$'\x1b') # Quit (q, Q, or ESC)
                clear
                echo -e "${BOLD}${GREEN}🎯 Presentatie voltooid!${NC}"
                echo ""
                exit 0
                ;;
        esac
    done
}

# Start the presentation
main
