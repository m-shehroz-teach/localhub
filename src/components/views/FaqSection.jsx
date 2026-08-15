import React, { useState } from 'react';
import { ChevronDown, Search, ShieldCheck, Zap, Smartphone, Layers } from 'lucide-react';

const faqCategories = [
  {
    id: 'device',
    title: 'Device & Transfer',
    icon: Smartphone,
    faqs: [
      {
        question: "How do I send a large video from my phone to my laptop without an app?",
        answer: "Open LocalHub on both your phone and laptop browsers, enter the same room code or scan the QR code to connect, then select your video file. The video will stream directly between your devices without installing software or signing in."
      },
      {
        question: "How can I transfer files from iPhone to Windows PC for free?",
        answer: "Because LocalHub runs inside modern web browsers like Safari and Chrome, you can pair an iPhone directly with a Windows PC. Just join the same room on both devices to start sending files instantly across platforms."
      },
      {
        question: "How do I share files between Android and Mac without a USB cable?",
        answer: "You can transfer photos, videos, and documents wire-free by opening LocalHub on both your Android Chrome browser and Mac Safari browser. Select your files to send them immediately over your local connection."
      },
      {
        question: "Can I share text or links from my phone clipboard to my computer desktop?",
        answer: "Yes! Paste your copied text or web link into the Text Sync box on your phone, click send, and it will appear live on your connected computer screen ready to be copied."
      },
      {
        question: "How do I transfer photos from phone to PC without losing quality?",
        answer: "Traditional messaging apps compress your images. LocalHub transfers raw, uncompressed photo files directly from your phone to your computer, preserving 100% of the original photo quality and resolution."
      }
    ]
  },
  {
    id: 'performance',
    title: 'Limits & Speed',
    icon: Zap,
    faqs: [
      {
        question: "Is there a file size limit for sending files online?",
        answer: "No. LocalHub has zero file size caps. Because files stream directly between browsers without being uploaded to cloud server hard drives, you can send 1GB, 10GB, or larger files without restrictions."
      },
      {
        question: "How fast is peer-to-peer (P2P) file sharing?",
        answer: "P2P transfers operate at your network's maximum capability. On a shared local network, transfers happen at high-speed local network rates. Over remote networks, files stream as fast as your connection allows without artificial bandwidth throttling."
      },
      {
        question: "Can I send an entire folder of files at once?",
        answer: "Yes, you can select multiple files or full folders to send simultaneously. Each item queues up automatically and transfers straight to the recipient device."
      },
      {
        question: "Why is P2P file transfer faster than cloud storage uploads?",
        answer: "Cloud storage forces you to wait twice: first to upload the file to a cloud server (like Google Drive or Dropbox), and then for the recipient to download it. P2P transfers stream data directly from sender to receiver in real time, cutting transfer times in half."
      },
      {
        question: "Do I need a fast internet connection to share files locally?",
        answer: "As long as both devices are connected to the same local router or hotspot, LocalHub transfers files over your local network pipeline, ensuring ultra-fast transfers even on slow internet connections."
      }
    ]
  },
  {
    id: 'security',
    title: 'Privacy & Safety',
    icon: ShieldCheck,
    faqs: [
      {
        question: "Is my file transfer private and secure?",
        answer: "Absolutely. All transfers are protected with End-to-End Encryption (E2EE) using client-side AES-GCM. Your files are encrypted right inside your browser before sending, meaning no third party can read or access your content."
      },
      {
        question: "Are my files uploaded or stored on any server?",
        answer: "No. LocalHub is a zero-knowledge, serverless file streaming service. Your files exist only on your device and the recipient's device—nothing is ever stored, cached, or logged on remote cloud servers."
      },
      {
        question: "Do I need to create an account or provide an email address?",
        answer: "No account, registration, phone number, or email is required. You can start sharing files instantly the moment you open the website."
      },
      {
        question: "What happens to my room code after I close the browser?",
        answer: "Room codes are temporary and ephemeral. Once you close your browser tab or disconnect, the room session ends and the encryption keys are immediately wiped from browser memory."
      },
      {
        question: "Is LocalHub safe to use on public Wi-Fi networks?",
        answer: "Yes. Because every payload is encrypted at the browser level before reaching the network, your files remain completely unreadable to anyone else monitoring public Wi-Fi networks."
      }
    ]
  },
  {
    id: 'general',
    title: 'Compatibility & More',
    icon: Layers,
    faqs: [
      {
        question: "What is a free web-based alternative to AirDrop for Windows and Android?",
        answer: "LocalHub acts as a cross-platform AirDrop alternative that works on any operating system—including Windows, Android, Linux, iOS, and macOS—without requiring Apple hardware."
      },
      {
        question: "How is LocalHub different from WeTransfer or Snapdrop?",
        answer: "Unlike WeTransfer, LocalHub has no file size limits, requires no email addresses, and doesn't store your files on external servers. Compared to standard web drop tools, LocalHub features built-in pre-transmission compression and real-time bandwidth meters."
      },
      {
        question: "Which web browsers support P2P file sharing?",
        answer: "LocalHub is supported on all modern HTML5 browsers with WebRTC support, including Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, Opera, and Brave on both desktop and mobile."
      },
      {
        question: "Can I send files to someone in another city or country?",
        answer: "Yes! While local transfers work on shared Wi-Fi, you can also share your private Room Key or link with anyone anywhere in the world to establish a direct, remote peer-to-peer connection."
      },
      {
        question: "Do I need to keep the browser tab open during a file transfer?",
        answer: "Yes, because the transfer streams directly between active browser sessions, keeping the tab open and active ensures your transfer completes without interruption."
      },
      {
        question: "What happens if a file transfer gets disconnected?",
        answer: "If your network briefly drops, the connection automatically attempts to reconnect. If disconnected completely, simply rejoin the room key to restart the transfer instantly."
      },
      {
        question: "Is LocalHub completely free to use?",
        answer: "Yes, LocalHub is 100% free with no hidden subscriptions, daily download limits, or paid paywalls."
      }
    ]
  }
];
export default function FaqSection() {
  const [activeTab, setActiveTab] = useState('device');
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Flatten all FAQs for search filtering and JSON-LD schema generation
  const allFaqs = faqCategories.flatMap((cat) => cat.faqs);

  const filteredFaqs = searchQuery.trim()
    ? allFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqCategories.find((cat) => cat.id === activeTab)?.faqs || [];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mt-16 max-w-4xl mx-auto px-4 py-8 border-t border-border-card">
      {/* Search Engine Optimization (SEO) JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": allFaqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })}
      </script>

      {/* Heading Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-4xl font-bold text-text-main tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-sm sm:text-base text-text-muted mt-2">
          Everything you need to know about sharing files and text between your devices.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          placeholder="Search questions (e.g. iPhone, size limit, privacy)..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setOpenIndex(null);
          }}
          className="w-full pl-11 pr-4 py-3 bg-bg-card-inner border border-border-card rounded-xl text-text-main placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition bg-opacity-80"
        />
      </div>

      {/* Category Tabs (Hidden when searching) */}
      {!searchQuery && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {faqCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab(cat.id);
                  setOpenIndex(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary text-primary-text shadow-lg shadow-primary/20'
                    : 'bg-bg-card-inner text-text-muted hover:text-text-main border border-border-card'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.title}
              </button>
            );
          })}
        </div>
      )}

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-bg-card-inner border border-border-card rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 focus:outline-none hover:bg-bg-card transition"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-text-main text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-text-muted shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-border-card">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-text-muted text-sm">
            No matching questions found for "{searchQuery}".
          </div>
        )}
      </div>
    </section>
  );
}