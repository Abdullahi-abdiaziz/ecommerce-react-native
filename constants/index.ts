export const COLORS = {
    // Brand Colors
    primary: "#0F172A",    // Deep Slate (Headings, primary text)
    secondary: "#64748B",  // Slate 500 (Secondary text, icons)
    accent: "#4F46E5",     // Indigo 600 (Actions, active states)
    
    // Background & Surfaces
    background: "#FFFFFF", // Clean white
    surface: "#F8FAFC",    // Slate 50 (Cards, inputs)
    
    // UI Elements
    border: "#E2E8F0",     // Slate 200 (Dividers, borders)
    error: "#EF4444",      // Red 500
    success: "#10B981",    // Emerald 500
    warning: "#F59E0B",    // Amber 500
    info: "#3B82F6",       // Blue 500
};


export const CATEGORIES = [
    { id: 1, name: "Men", icon: "man-outline" },
    { id: 2, name: "Women", icon: "woman-outline" },
    { id: 3, name: "Kids", icon: "happy-outline" },
    { id: 4, name: "Shoes", icon: "footsteps-outline" },
    { id: 5, name: "Bag", icon: "briefcase-outline" },
    { id: 6, name: "Other", icon: "grid-outline" },
];

export const PROFILE_MENU = [
    { id: 1, title: "My Orders", icon: "receipt-outline", route: "/orders" },
    { id: 2, title: "Shipping Addresses", icon: "location-outline", route: "/addresses" },
    { id: 4, title: "My Reviews", icon: "star-outline", route: "/" },
    { id: 5, title: "Settings", icon: "settings-outline", route: "/" },
];

export const getStatusColor = (status: string) => {
    switch (status) {
        case "placed":
            return "bg-yellow-50 text-yellow-900";
        case "processing":
            return "bg-indigo-50 text-indigo-900";
        case "shipped":
            return "bg-purple-50 text-purple-900";
        case "delivered":
            return "bg-green-50 text-green-900";
        case "cancelled":
            return "bg-red-50 text-red-900";
        default:
            return "bg-gray-50 text-gray-900";
    }
};
