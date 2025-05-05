export const getStrikethroughStyle = (direction?: string, color?: string) => {
    const baseStyle = {
        position: "absolute",
        backgroundColor: color || "#4CAF50",
        opacity: 0.7,
    };

    switch (direction) {
        case "vertical":
            return {
                ...baseStyle,
                width: 3,
                top: -5,
                bottom: -5,
                left: "50%",
                transform: [{ translateX: -1.5 }],
            };
        case "diagonal-right":
            return {
                ...baseStyle,
                height: 3,
                width: "141%", // √2 * 100% to cover diagonal
                top: "50%",
                left: "-20%",
                transform: [{ translateY: -1.5 }, { rotate: "45deg" }],
            };
        case "diagonal-left":
            return {
                ...baseStyle,
                height: 3,
                width: "141%", // √2 * 100% to cover diagonal
                top: "50%",
                left: "-20%",
                transform: [{ translateY: -1.5 }, { rotate: "-45deg" }],
            };
        default: // horizontal
            return {
                ...baseStyle,
                height: 3,
                left: -5,
                right: -5,
                top: "50%",
                transform: [{ translateY: -1.5 }],
            };
    }
};

export const getRandomColor = () => {
    const colors = [
        "#FF6B6B", // Red
        "#4ECDC4", // Turquoise
        "#45B7D1", // Light Blue
        "#96CEB4", // Sage Green
        "#D4A5A5", // Dusty Rose
        "#9B59B6", // Purple
        "#3498DB", // Blue
        "#E67E22", // Orange
        "#16A085", // Green
        "#F39C12", // Yellow
        "#D35400", // Pumpkin
        "#8E44AD", // Dark Purple
        "#2980B9", // Dark Blue
        "#C0392B", // Dark Red
        "#27AE60", // Dark Green
        "#F1C40F", // Dark Yellow
        "#7F8C8D", // Dark Gray
        "#34495E", // Dark Blue Gray
        "#2C3E50", // Dark Gray
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};
