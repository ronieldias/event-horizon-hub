import { Link } from 'react-router-dom';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const formattedDate = format(new Date(event.date), "d 'de' MMM", { locale: ptBR });
  const spotsLeft = event.capacity - event.registeredCount;
  const isSoldOut = spotsLeft <= 0;
  const isAlmostFull = spotsLeft <= 10 && spotsLeft > 0;

  return (
    <Link to={`/events/${event.id}`}>
      <Card className="group overflow-hidden glass-card hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 h-full">
        <div className="relative aspect-[16/9] overflow-hidden">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Calendar className="h-12 w-12 text-primary/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {event.category}
            </Badge>
            {event.isFree && (
              <Badge className="bg-primary/90 text-primary-foreground">
                Gratuito
              </Badge>
            )}
          </div>

          {isSoldOut && (
            <div className="absolute top-3 right-3">
              <Badge variant="destructive">Esgotado</Badge>
            </div>
          )}
          {isAlmostFull && !isSoldOut && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-accent text-accent-foreground">Últimas vagas</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5 space-y-4">
          <div>
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            {event.shortDescription && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {event.shortDescription}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formattedDate}</span>
              <span className="text-border">•</span>
              <Clock className="h-4 w-4 text-primary" />
              <span>{event.time}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="line-clamp-1">{event.city}, {event.state}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span>
                {isSoldOut ? (
                  'Esgotado'
                ) : (
                  `${spotsLeft} vaga${spotsLeft !== 1 ? 's' : ''} restante${spotsLeft !== 1 ? 's' : ''}`
                )}
              </span>
            </div>
          </div>

          {!event.isFree && event.price && (
            <div className="pt-3 border-t border-border/50">
              <span className="text-lg font-bold text-primary">
                R$ {event.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
