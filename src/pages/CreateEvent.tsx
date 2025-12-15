import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Calendar, Loader2, Save, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const eventSchema = z.object({
  title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres'),
  description: z.string().min(20, 'Descrição deve ter no mínimo 20 caracteres'),
  shortDescription: z.string().max(150, 'Descrição curta deve ter no máximo 150 caracteres').optional(),
  category: z.string().min(1, 'Selecione uma categoria'),
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().min(3, 'Local é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  address: z.string().optional(),
  capacity: z.number().min(1, 'Capacidade deve ser no mínimo 1'),
  isFree: z.boolean(),
  price: z.number().optional(),
  imageUrl: z.string().url('URL inválida').optional().or(z.literal('')),
});

type EventFormData = z.infer<typeof eventSchema>;

const categories = [
  'Tecnologia',
  'Negócios',
  'Música',
  'Arte',
  'Esportes',
  'Educação',
  'Gastronomia',
  'Saúde',
  'Networking',
];

const states = ['SP', 'RJ', 'MG', 'RS', 'PR', 'BA', 'SC', 'GO', 'PE', 'CE'];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFree, setIsFree] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      isFree: true,
      capacity: 50,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: EventFormData & { status: 'draft' | 'published' }) =>
      api.createEvent(data),
    onSuccess: () => {
      toast({
        title: 'Evento criado!',
        description: 'Seu evento foi criado com sucesso.',
      });
      navigate('/organizer/events');
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar evento',
        description: error instanceof Error ? error.message : 'Não foi possível criar o evento',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: EventFormData, status: 'draft' | 'published') => {
    createMutation.mutate({ ...data, status });
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/organizer/events">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Criar Novo Evento</h1>
        <p className="text-muted-foreground mt-1">
          Preencha as informações do seu evento
        </p>
      </div>

      <form className="space-y-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Evento *</Label>
              <Input
                id="title"
                placeholder="Ex: Tech Summit Brasil 2024"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Descrição Curta</Label>
              <Input
                id="shortDescription"
                placeholder="Uma breve descrição do evento (máx. 150 caracteres)"
                {...register('shortDescription')}
              />
              {errors.shortDescription && (
                <p className="text-sm text-destructive">{errors.shortDescription.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição Completa *</Label>
              <Textarea
                id="description"
                placeholder="Descreva seu evento em detalhes..."
                rows={6}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://exemplo.com/imagem.jpg"
                  {...register('imageUrl')}
                />
                {errors.imageUrl && (
                  <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Data e Horário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Data de Início *</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Horário de Início *</Label>
                <Input
                  id="time"
                  type="time"
                  {...register('time')}
                />
                {errors.time && (
                  <p className="text-sm text-destructive">{errors.time.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Horário de Término</Label>
                <Input
                  id="endTime"
                  type="time"
                  {...register('endTime')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Local</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">Nome do Local *</Label>
              <Input
                id="location"
                placeholder="Ex: Centro de Convenções"
                {...register('location')}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Ex: Rua das Flores, 123"
                {...register('address')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  placeholder="Ex: São Paulo"
                  {...register('city')}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Estado *</Label>
                <Select onValueChange={(value) => setValue('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className="text-sm text-destructive">{errors.state.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Capacidade e Preço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidade Máxima *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  {...register('capacity', { valueAsNumber: true })}
                />
                {errors.capacity && (
                  <p className="text-sm text-destructive">{errors.capacity.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isFree">Evento Gratuito</Label>
                  <Switch
                    id="isFree"
                    checked={isFree}
                    onCheckedChange={(checked) => {
                      setIsFree(checked);
                      setValue('isFree', checked);
                    }}
                  />
                </div>

                {!isFree && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      {...register('price', { valueAsNumber: true })}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar Rascunho
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={handleSubmit((data) => onSubmit(data, 'published'))}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Publicar Evento
          </Button>
        </div>
      </form>
    </div>
  );
}
