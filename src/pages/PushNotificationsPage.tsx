import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { Label } from '@/components/ui/label';

const PushNotificationsPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('/');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const templates = [
    {
      name: 'Скидка выходного дня',
      title: '🎉 Скидка 20% на выходные!',
      body: 'Забронируйте апартаменты на эти выходные и получите скидку 20%. Предложение ограничено!',
      url: '/promotions'
    },
    {
      name: 'Новая акция',
      title: '✨ Специальное предложение',
      body: 'Новая акция! Бронируйте от 3 ночей и получите скидку 15%',
      url: '/promotions'
    },
    {
      name: 'Сезонная акция',
      title: '🍂 Осенние скидки до 30%',
      body: 'Наслаждайтесь золотой осенью в Москве! Скидки до 30% на все апартаменты',
      url: '/'
    },
    {
      name: 'Раннее бронирование',
      title: '⏰ Раннее бронирование',
      body: 'Забронируйте заранее и сэкономьте! Специальные цены на будущие даты',
      url: '/booking'
    }
  ];

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setTitle(template.title);
    setBody(template.body);
    setUrl(template.url);
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !body.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните заголовок и текст уведомления',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);
    try {
      const response = await fetch('https://functions.poehali.dev/36f610d6-e5b4-4e1a-852d-7cba847873cd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          url,
          tag: 'owner-notification'
        })
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Push-уведомление отправлено всем подписчикам',
        });
        setTitle('');
        setBody('');
        setUrl('/');
      } else {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить уведомление',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  const handleTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title || 'P9 Апартаменты', {
        body: body || 'Тестовое уведомление',
        icon: 'https://cdn.poehali.dev/projects/71cc1cad-d51c-42e2-a128-9fd9502921a6/files/143e469d-5802-4200-9887-ffd01c3e42aa.jpg',
        badge: 'https://cdn.poehali.dev/projects/71cc1cad-d51c-42e2-a128-9fd9502921a6/files/143e469d-5802-4200-9887-ffd01c3e42aa.jpg'
      });
      toast({
        title: 'Тест выполнен',
        description: 'Проверьте как выглядит уведомление'
      });
    } else {
      toast({
        title: 'Уведомления заблокированы',
        description: 'Разрешите уведомления в браузере для теста',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Icon name="Bell" size={32} className="text-gold-500" />
              Push-уведомления
            </h1>
            <p className="text-white/70 mt-1">Отправляйте уведомления всем подписчикам</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/owner-dashboard')}
            className="gap-2"
          >
            <Icon name="ArrowLeft" size={16} />
            Назад
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="bg-charcoal-800/50 border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-white">Создать уведомление</CardTitle>
                <CardDescription className="text-white/70">
                  Заполните форму для отправки push-уведомления
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Заголовок</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например: Скидка 20% на выходные!"
                    maxLength={50}
                    className="bg-charcoal-900/50 border-gold-500/20 text-white"
                  />
                  <p className="text-xs text-white/50">{title.length}/50 символов</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body" className="text-white">Текст уведомления</Label>
                  <Textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Описание акции или предложения..."
                    rows={4}
                    maxLength={120}
                    className="bg-charcoal-900/50 border-gold-500/20 text-white resize-none"
                  />
                  <p className="text-xs text-white/50">{body.length}/120 символов</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url" className="text-white">Ссылка при клике</Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="/promotions"
                    className="bg-charcoal-900/50 border-gold-500/20 text-white"
                  />
                  <p className="text-xs text-white/50">Куда перейдет пользователь при клике</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSendNotification}
                    disabled={sending || !title || !body}
                    className="flex-1 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-white font-semibold"
                  >
                    {sending ? (
                      <>
                        <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Icon name="Send" size={16} className="mr-2" />
                        Отправить всем
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleTestNotification}
                    variant="outline"
                    disabled={!title || !body}
                    className="gap-2"
                  >
                    <Icon name="TestTube" size={16} />
                    Тест
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-charcoal-800/50 border-gold-500/20">
              <CardHeader>
                <CardTitle className="text-white">Шаблоны</CardTitle>
                <CardDescription className="text-white/70">
                  Быстро создайте уведомление из шаблона
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template, index) => (
                  <div
                    key={index}
                    onClick={() => handleTemplateSelect(template)}
                    className="p-4 bg-charcoal-900/50 border border-gold-500/10 rounded-lg cursor-pointer hover:border-gold-500/30 hover:bg-charcoal-900/70 transition-all group"
                  >
                    <h3 className="font-semibold text-white group-hover:text-gold-400 transition-colors flex items-center gap-2">
                      <Icon name="FileText" size={16} className="text-gold-500" />
                      {template.name}
                    </h3>
                    <p className="text-sm text-white/70 mt-1">{template.title}</p>
                    <p className="text-xs text-white/50 mt-1 line-clamp-2">{template.body}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-blue-900/20 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Info" size={20} className="text-blue-400" />
                  Информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-white/70">
                <p>• Уведомления получат только пользователи, которые разрешили их</p>
                <p>• Тест покажет как выглядит уведомление только вам</p>
                <p>• Используйте эмодзи для привлечения внимания</p>
                <p>• Оптимальная длина заголовка: 30-40 символов</p>
                <p>• Лучшее время отправки: 10:00-12:00 и 18:00-20:00</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationsPage;
