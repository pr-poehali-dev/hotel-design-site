import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const shareUrl = window.location.origin;
  const shareText = 'Апартаменты на Поклонной 9 посуточно | ENZO Отель Москва';

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setIsOpen(true);
        }
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Ссылка скопирована!",
      description: "Теперь вы можете поделиться ей с друзьями",
    });
    setIsOpen(false);
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: 'MessageCircle',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      color: 'hover:bg-green-50 hover:text-green-600'
    },
    {
      name: 'Telegram',
      icon: 'Send',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'hover:bg-blue-50 hover:text-blue-600'
    },
    {
      name: 'ВКонтакте',
      icon: 'Users',
      url: `https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
      color: 'hover:bg-blue-50 hover:text-blue-700'
    },
  ];

  return (
    <div className="relative">
      <Button
        onClick={handleNativeShare}
        variant="outline"
        size="lg"
        className="bg-white/90 backdrop-blur-sm border-gold-500/20 hover:bg-gold-50 hover:border-gold-500 text-charcoal-900 gap-2 shadow-lg"
      >
        <Icon name="Share2" size={20} />
        Поделиться
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl border border-gold-500/20 p-4 z-50 w-64 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${link.color}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon name={link.icon} size={20} />
                  <span className="font-medium">{link.name}</span>
                </a>
              ))}
              
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50 w-full text-left"
              >
                <Icon name="Link" size={20} />
                <span className="font-medium">Копировать ссылку</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
