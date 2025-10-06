import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface ShareButtonsProps {
  title?: string;
  text?: string;
  url?: string;
}

const ShareButtons = ({ 
  title = "Апартаменты на Поклонной 9 | ENZO Отель",
  text = "Премиум апартаменты посуточно в Москве рядом с Парком Победы",
  url = typeof window !== 'undefined' ? window.location.href : ''
}: ShareButtonsProps) => {
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    vk: `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}&description=${encodedText}`,
    ok: `https://connect.ok.ru/offer?url=${encodedUrl}&title=${encodedTitle}&description=${encodedText}`,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    alert('Ссылка скопирована!');
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-muted-foreground">Поделиться:</p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareLinks.whatsapp, '_blank')}
          className="gap-2"
        >
          <Icon name="MessageCircle" size={16} />
          WhatsApp
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareLinks.telegram, '_blank')}
          className="gap-2"
        >
          <Icon name="Send" size={16} />
          Telegram
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareLinks.vk, '_blank')}
          className="gap-2"
        >
          <Icon name="Share2" size={16} />
          ВКонтакте
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareLinks.ok, '_blank')}
          className="gap-2"
        >
          <Icon name="Circle" size={16} />
          Одноклассники
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          <Icon name="Copy" size={16} />
          Копировать
        </Button>

        {navigator.share && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNativeShare}
            className="gap-2"
          >
            <Icon name="Share" size={16} />
            Ещё
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShareButtons;
