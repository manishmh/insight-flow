// components/ChatBox.tsx
import { useEffect, useState } from "react";

const ChatBox: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false); // Type for boolean visibility state
  const [text, setText] = useState<string>(""); // Type for message text state
  const message: string =
    "I think we can give them a gift card and write a handwritten note.";

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout; // Timeout for typing effect
    let showSymbolsTimeout: NodeJS.Timeout; // Timeout to show thumbs-up and symbols
    let hideTimeout: NodeJS.Timeout; // Timeout for hiding the message
    let interval: NodeJS.Timeout; // Interval for repeating the animation

    const typeText = () => {
      setVisible(true);
      setText(""); // Clear text for typing animation

      message.split("").forEach((char, index) => {
        setTimeout(() => {
          setText((prev) => prev + char);
        }, index * 50); // Typing speed: 50ms per character
      });

      // Timeout to add symbols after the message is fully typed
      typingTimeout = setTimeout(() => {
        setText((prev) => prev + " 👍 ✉️");
      }, message.length * 50 + 500); // Wait for typing to finish, then show symbols

      // Timeout to hide the chat box after showing symbols
      hideTimeout = setTimeout(() => {
        setVisible(false);
      }, message.length * 50 + 1500); // Delay after symbols are shown
    };

    // Run typing animation once immediately
    typeText();

    // Set interval for repeating the animation every 6 seconds
    interval = setInterval(typeText, 6000);

    // Cleanup function to clear timeouts and interval
    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(showSymbolsTimeout);
      clearTimeout(hideTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-8 left-8 ${
        visible ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-500 ease-in-out`}
    >
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-xs">
        <p>{text}</p>
      </div>
    </div>
  );
};

export default ChatBox;
