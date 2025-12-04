// Fake data for testing CShare
// This data includes various availability configurations and handover times

const seedItems = [
    // 1. Always Available + Flexible Handover
    {
        name: "KitchenAid Stand Mixer",
        category: "Kitchen",
        description: "Professional 5-quart stand mixer with multiple attachments. Perfect for baking bread, cookies, and cakes. Includes dough hook, flat beater, and wire whip.",
        price: 8.00,
        availability: {
            type: 'always'
        },
        handoverTime: null // Flexible all day
    },
    // 2. Weekdays Only + Evening Handover
    {
        name: "Dyson V11 Vacuum Cleaner",
        category: "Appliances",
        description: "Cordless stick vacuum with powerful suction and HEPA filtration. Available weekdays only (Mon-Fri). Handover: 18:00-22:00. Great for apartments and quick cleanups.",
        price: 10.00,
        availability: {
            type: 'recurring',
            daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
        },
        handoverTime: {
            start: '18:00',
            end: '22:00'
        }
    },
    // 3. Weekends Only + Morning Handover
    {
        name: "IKEA POÄNG Armchair",
        category: "Furniture",
        description: "Comfortable bentwood armchair with cushion. Available weekends only (Sat-Sun). Handover: 09:00-12:00. Perfect for reading or studying. Modern Scandinavian design.",
        price: 5.00,
        availability: {
            type: 'recurring',
            daysOfWeek: [0, 6] // Saturday and Sunday
        },
        handoverTime: {
            start: '09:00',
            end: '12:00'
        }
    },
    // 4. Weekdays + Business Hours Handover
    {
        name: "Canon EOS Rebel T7 DSLR Camera",
        category: "Electronics",
        description: "24.1MP digital camera with WiFi. Available Mon-Fri. Handover: 09:00-17:00. Includes 18-55mm lens, battery, charger, and memory card. Great for photography projects.",
        price: 15.00,
        availability: {
            type: 'recurring',
            daysOfWeek: [1, 2, 3, 4, 5]
        },
        handoverTime: {
            start: '09:00',
            end: '17:00'
        }
    },
    // 5. Everyday + Afternoon Handover
    {
        name: "Instant Pot Duo 7-in-1",
        category: "Kitchen",
        description: "Multi-functional pressure cooker. Available every day. Handover: 14:00-20:00. 6-quart capacity perfect for meal prep.",
        price: 7.00,
        availability: {
            type: 'recurring',
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6] // Every day
        },
        handoverTime: {
            start: '14:00',
            end: '20:00'
        }
    },
    // 6. Specific Days + Flexible Handover
    {
        name: "Adjustable Standing Desk",
        category: "Furniture",
        description: "Electric height-adjustable desk. Available Tuesdays and Thursdays only. Handover: Flexible. 48x30 inch surface perfect for dual monitor setup. Promotes better posture and productivity.",
        price: 10.00,
        availability: {
            type: 'recurring',
            daysOfWeek: [2, 4] // Tuesday and Thursday
        },
        handoverTime: null // Flexible
    },
    // 7. Everyday + Morning Handover
    {
        name: "Espresso Machine",
        category: "Kitchen",
        description: "Semi-automatic espresso machine. Available every day. Handover: 06:00-12:00. Perfect for early risers who love quality coffee. Includes milk frother.",
        price: 6.00,
        availability: {
            type: 'recurring',
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6] // Every day
        },
        handoverTime: {
            start: '06:00',
            end: '12:00'
        }
    },
    // 8. Date Range (Next Week) + Evening Handover
    {
        name: "Nintendo Switch Console",
        category: "Electronics",
        description: "Gaming console with two Joy-Con controllers. Available next week only (7-14 days from now). Handover: 18:00-21:00. Includes Mario Kart 8 Deluxe and Super Smash Bros Ultimate.",
        price: 12.00,
        availability: {
            type: 'dateRange',
            startDateOffset: 7, // Days from now
            endDateOffset: 14
        },
        handoverTime: {
            start: '18:00',
            end: '21:00'
        }
    },
    // 9. Date Range (Starting Tomorrow) + Lunch Handover
    {
        name: "Portable Air Conditioner",
        category: "Appliances",
        description: "10,000 BTU portable AC unit with remote control. Available starting tomorrow, no end date. Handover: 12:00-14:00. Perfect for summer months in dorm rooms or apartments.",
        price: 15.00,
        availability: {
            type: 'dateRange',
            startDateOffset: 1,
            endDateOffset: null
        },
        handoverTime: {
            start: '12:00',
            end: '14:00'
        }
    },
    // 10. Date Range (Until 30 days) + Flexible Handover
    {
        name: "Folding Camping Table",
        category: "Other",
        description: "Lightweight aluminum camping table. Available now until 30 days from now. Handover: Flexible. Great for outdoor events, tailgating, or extra workspace.",
        price: 0,
        availability: {
            type: 'dateRange',
            startDateOffset: null,
            endDateOffset: 30
        },
        handoverTime: null // Flexible
    },
    // 11. Date Range (Specific Period) + Late Night Handover
    {
        name: "Ninja Professional Blender",
        category: "Kitchen",
        description: "1000-watt blender perfect for smoothies. Available from 3 days to 10 days from now. Handover: 20:00-23:00. 72oz pitcher with easy-pour spout. BPA-free and dishwasher safe.",
        price: 5.00,
        availability: {
            type: 'dateRange',
            startDateOffset: 3,
            endDateOffset: 10
        },
        handoverTime: {
            start: '20:00',
            end: '23:00'
        }
    },
    // 12. Date Range (This Week) + Flexible Handover
    {
        name: "Portable Projector",
        category: "Electronics",
        description: "HD portable projector with HDMI and USB inputs. Available today through 5 days from now. Handover: Flexible. Perfect for movie nights or presentations. Includes screen.",
        price: 8.00,
        availability: {
            type: 'dateRange',
            startDateOffset: 0,
            endDateOffset: 5
        },
        handoverTime: null // Flexible
    }
];

// Make available globally for ES6 modules (app.js)
window.seedItems = seedItems;

// Export for use in Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { seedItems };
}
