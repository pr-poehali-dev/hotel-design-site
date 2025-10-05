import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface VideoUploadSectionProps {
  videos: string[];
  videoUrl: string;
  onVideoUrlChange: (value: string) => void;
  onAddVideo: () => void;
  onRemoveVideo: (index: number) => void;
}

const VideoUploadSection = ({
  videos,
  videoUrl,
  onVideoUrlChange,
  onAddVideo,
  onRemoveVideo,
}: VideoUploadSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Видео</Label>
      <div className="flex gap-2">
        <Input
          value={videoUrl}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          placeholder="Вставьте ссылку на видео (YouTube, Vimeo и др.)"
        />
        <Button type="button" onClick={onAddVideo}>
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить
        </Button>
      </div>
      {videos && videos.length > 0 && (
        <div className="space-y-3 mt-4">
          {videos.map((video, idx) => (
            <div key={idx} className="relative group">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={video}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoveVideo(idx)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoUploadSection;
