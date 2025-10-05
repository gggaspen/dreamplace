# Swiper React Library - Documentación Completa

## Descripción General
La librería Swiper React está siendo utilizada en el componente `Carousel.tsx` para crear un carousel de imágenes con autoplay y navegación. Este documento describe cómo implementar y manejar eventos de cambio de slide en Swiper.

## Implementación Actual en Carousel.tsx

### Configuración Básica
```typescript
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

<Swiper
  className="progress-slide-carousel"
  modules={[Autoplay, Pagination]}
  loop={images.length > 1}
  autoplay={{
    delay: 2000,
    disableOnInteraction: !isDesktop,
    pauseOnMouseEnter: isDesktop,
  }}
  speed={100}
>
  {images.map((image, index) => (
    <SwiperSlide key={image.id}>
      {/* Contenido del slide */}
    </SwiperSlide>
  ))}
</Swiper>
```

## Eventos de Cambio de Slide

### 1. onSlideChange
**Descripción**: Se dispara cada vez que cambia el slide activo, sin importar la dirección o el orden.

**Implementación básica**:
```typescript
<Swiper
  onSlideChange={() => console.log('Slide cambió')}
  // ... otras props
>
```

**Con acceso a la instancia de Swiper**:
```typescript
<Swiper
  onSlideChange={(swiper) => {
    console.log('Slide actual:', swiper.activeIndex);
    console.log('Slide anterior:', swiper.previousIndex);
    console.log('Índice real:', swiper.realIndex);
    console.log('Progreso:', swiper.progress);
  }}
  // ... otras props
>
```

### 2. onSlideChangeTransitionStart
**Descripción**: Se dispara al inicio de la animación cuando comienza la transición a otro slide.

```typescript
<Swiper
  onSlideChangeTransitionStart={(swiper) => {
    console.log('Transición iniciada desde:', swiper.previousIndex);
    console.log('Hacia slide:', swiper.activeIndex);
  }}
  // ... otras props
>
```

### 3. onSlideChangeTransitionEnd
**Descripción**: Se dispara cuando termina la animación de transición entre slides.

```typescript
<Swiper
  onSlideChangeTransitionEnd={(swiper) => {
    console.log('Transición completada al slide:', swiper.activeIndex);
  }}
  // ... otras props
>
```

## Propiedades Útiles de la Instancia Swiper

### Índices
- `swiper.activeIndex`: Índice del slide actualmente activo
- `swiper.realIndex`: Índice real del slide (útil cuando `loop: true`)
- `swiper.previousIndex`: Índice del slide anterior

### Estados
- `swiper.progress`: Progreso actual de la transición (0 a 1)
- `swiper.isBeginning`: `true` si está en el primer slide
- `swiper.isEnd`: `true` si está en el último slide

### Información de slides
- `swiper.slides.length`: Número total de slides
- `swiper.slides`: Array con todos los elementos slide

## Ejemplo Completo de Implementación

```typescript
interface SlideChangeData {
  activeIndex: number;
  realIndex: number;
  previousIndex: number;
  direction: 'next' | 'prev';
}

export default function Carousel({ fotos, banner_text }: ICarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const handleSlideChange = (swiper: any) => {
    const slideData: SlideChangeData = {
      activeIndex: swiper.activeIndex,
      realIndex: swiper.realIndex,
      previousIndex: swiper.previousIndex,
      direction: swiper.activeIndex > swiper.previousIndex ? 'next' : 'prev'
    };
    
    setCurrentSlide(swiper.realIndex);
    console.log('Cambio de slide:', slideData);
  };

  const handleTransitionStart = (swiper: any) => {
    console.log('Iniciando transición al slide:', swiper.activeIndex);
  };

  const handleTransitionEnd = (swiper: any) => {
    console.log('Transición completada al slide:', swiper.activeIndex);
  };

  return (
    <Swiper
      onSlideChange={handleSlideChange}
      onSlideChangeTransitionStart={handleTransitionStart}
      onSlideChangeTransitionEnd={handleTransitionEnd}
      // ... resto de configuración
    >
      {fotos.map((image, index) => (
        <SwiperSlide key={image.id}>
          {/* Contenido */}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
```

## Casos de Uso Comunes

### 1. Tracking de Slides para Analytics
```typescript
const trackSlideView = (swiper: any) => {
  // Enviar evento a Google Analytics, Mixpanel, etc.
  analytics.track('slide_viewed', {
    slide_index: swiper.realIndex,
    total_slides: swiper.slides.length
  });
};

<Swiper onSlideChange={trackSlideView}>
```

### 2. Actualizar Indicadores Personalizados
```typescript
const [activeSlide, setActiveSlide] = useState(0);

<Swiper 
  onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
>
  {/* slides */}
</Swiper>

{/* Indicadores personalizados */}
<div className="custom-pagination">
  {fotos.map((_, index) => (
    <span 
      key={index}
      className={index === activeSlide ? 'active' : ''}
    />
  ))}
</div>
```

### 3. Precargar Contenido del Siguiente Slide
```typescript
const preloadNextSlide = (swiper: any) => {
  const nextIndex = (swiper.realIndex + 1) % fotos.length;
  // Lógica para precargar imagen del siguiente slide
  preloadImage(fotos[nextIndex].url);
};

<Swiper onSlideChangeTransitionStart={preloadNextSlide}>
```

## Diferencias Entre Eventos

| Evento | Momento | Uso Recomendado |
|--------|---------|-----------------|
| `onSlideChange` | Al cambiar el slide activo | Estado general, tracking |
| `onSlideChangeTransitionStart` | Al iniciar animación | Preparación, precarga |
| `onSlideChangeTransitionEnd` | Al terminar animación | Confirmación, limpieza |

## Consideraciones Importantes

1. **Loop Mode**: Cuando `loop: true`, usar `realIndex` en lugar de `activeIndex` para obtener la posición real
2. **Performance**: Los eventos se disparan en cada cambio, evitar operaciones pesadas
3. **Autoplay**: Los eventos también se disparan con autoplay activo
4. **Direction Detection**: Comparar `activeIndex` con `previousIndex` para determinar dirección

## Compatibilidad y Futuro

**Nota**: La documentación oficial indica que Swiper React podría ser deprecado en futuras versiones en favor de Swiper Element (Web Components). Sin embargo, para 2024 sigue siendo la opción más estable y recomendada para proyectos React.

Para proyectos nuevos, considerar la migración gradual a Swiper Element:
```typescript
// Futuro enfoque con Swiper Element
import { register } from 'swiper/element/bundle';

useEffect(() => {
  register();
  
  swiperRef.current.addEventListener('swiperslidechange', (e) => {
    console.log('Slide cambió:', e.detail);
  });
}, []);
```