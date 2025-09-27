# Nelson-GPT

A production-ready Progressive Web Application that serves as an AI-powered pediatric medical assistant, featuring an exact ChatGPT interface replication with specialized pediatric medical knowledge from the Nelson Textbook of Pediatrics.

## Features

### 🏥 Medical AI Assistant
- **Evidence-Based Responses**: Powered by Nelson Textbook of Pediatrics
- **Medical Citations**: Proper referencing with chapter and page numbers
- **Specialized Knowledge**: Pediatric cardiology, neurology, endocrinology, emergency medicine
- **Clinical Decision Support**: Differential diagnoses and treatment protocols

### 🎯 Exact ChatGPT Interface
- **Pixel-Perfect Replication**: Identical UI/UX to ChatGPT
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Themes**: Full theme support with system preference detection
- **Smooth Animations**: Framer Motion powered interactions

### 📱 Progressive Web App
- **Offline Functionality**: Works without internet connection
- **Push Notifications**: Medical updates and alerts
- **Home Screen Installation**: Native app-like experience
- **Background Sync**: Automatic data synchronization

### 🔒 HIPAA Compliant
- **End-to-End Encryption**: AES-256-GCM encryption
- **Secure Authentication**: Multi-factor authentication support
- **Audit Logging**: Complete interaction tracking
- **Data Retention**: 7-year medical record compliance

### ⚙️ Advanced Customization
- **Medical Preferences**: Response style, specialization focus
- **Accessibility Options**: Font size, high contrast, screen reader support
- **Settings Management**: Import/export configuration
- **Notification Control**: Customizable alert preferences

## Technology Stack

### Frontend
- **React 18.2.0** - UI library
- **TypeScript 5.0.0** - Type safety
- **Vite 5.0.0** - Build tool
- **Tailwind CSS 3.4.0** - Styling
- **Framer Motion 10.0.0** - Animations
- **React Router 6.0.0** - Routing

### State Management
- **Zustand 4.4.0** - State management
- **Persist Middleware** - Local storage
- **Immer** - Immutable updates

### Backend Services
- **Supabase** - Database and authentication
- **Mistral AI** - Language model integration
- **Pinecone** - Vector database for medical embeddings

### PWA Features
- **Vite PWA Plugin** - Service worker generation
- **Workbox** - Caching strategies
- **Web Push API** - Notifications
- **Background Sync** - Offline functionality

## Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager

### Setup

1. Clone the repository
```bash
git clone https://github.com/your-org/nelson-gpt.git
cd nelson-gpt
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Configuration

### Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# AI Service Configuration
VITE_MISTRAL_API_KEY=your-mistral-api-key

# Medical Database
VITE_MEDICAL_DATASET_TABLE=godzilla_medical_dataset
VITE_EMBEDDINGS_TABLE=medical_embeddings

# Security
VITE_ENCRYPTION_KEY=your-encryption-key
```

### Medical Knowledge Base Setup

1. **Import Nelson Textbook Data**:
   ```bash
   npm run import-medical-data
   ```

2. **Generate Embeddings**:
   ```bash
   npm run generate-embeddings
   ```

3. **Configure Vector Search**:
   ```bash
   npm run setup-vector-search
   ```

## Usage

### For Healthcare Professionals

1. **Login**: Use your healthcare organization email
2. **New Consultation**: Click "New Chat" to start a medical consultation
3. **Ask Questions**: Type pediatric medical questions or select from examples
4. **Review Responses**: Read AI-generated responses with medical citations
5. **Export Conversations**: Save consultations in Markdown or PDF format

### Medical Specialties Supported

- **General Pediatrics**: Common childhood conditions and treatments
- **Pediatric Cardiology**: Heart conditions and ECG interpretation
- **Pediatric Neurology**: Neurological disorders and seizures
- **Pediatric Endocrinology**: Hormonal and metabolic disorders
- **Pediatric Emergency**: Acute care and emergency protocols

### Clinical Decision Support

- **Differential Diagnoses**: Systematic approach to diagnosis
- **Treatment Protocols**: Evidence-based treatment guidelines
- **Drug Dosages**: Pediatric-specific medication calculations
- **Diagnostic Workup**: Recommended tests and procedures

## Deployment

### Production Deployment

1. **Build Application**:
   ```bash
   npm run build
   ```

2. **Deploy to CDN**:
   ```bash
   npm run deploy:cdn
   ```

3. **Deploy to Server**:
   ```bash
   npm run deploy:server
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Environment-Specific Deployment

#### Development
```bash
npm run dev
```

#### Staging
```bash
npm run build:staging
npm run deploy:staging
```

#### Production
```bash
npm run build:production
npm run deploy:production
```

## Security

### HIPAA Compliance

- **Data Encryption**: AES-256-GCM for all medical data
- **Access Controls**: Role-based authentication and authorization
- **Audit Logging**: Complete interaction tracking
- **Data Retention**: Configurable retention policies

### Security Best Practices

- **Input Validation**: Sanitize all user inputs
- **HTTPS Only**: Enforce secure connections
- **Content Security Policy**: Prevent XSS attacks
- **Regular Security Audits**: Automated vulnerability scanning

## Testing

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### Medical Content Validation
```bash
npm run test:medical-content
```

## Performance

### Optimization Features

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format with fallbacks
- **Caching Strategies**: Intelligent service worker caching
- **Bundle Analysis**: Webpack bundle analyzer

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Cumulative Layout Shift**: < 0.1

## Accessibility

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and descriptions
- **High Contrast Mode**: Enhanced visibility options
- **Font Size Adjustment**: User-controlled text sizing

### Accessibility Features

- **Focus Management**: Clear focus indicators
- **Alternative Text**: Descriptive alt text for images
- **Semantic HTML**: Proper heading hierarchy
- **Color Contrast**: 4.5:1 minimum contrast ratio

## Contributing

### Development Guidelines

1. **Code Style**: Follow ESLint and Prettier configuration
2. **Commit Messages**: Use conventional commits format
3. **Testing**: Maintain >90% test coverage
4. **Documentation**: Update README for new features

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Medical Disclaimer

**Important**: Nelson-GPT is designed for healthcare professionals and provides educational information based on the Nelson Textbook of Pediatrics. This tool should not replace professional medical judgment or direct patient care. Always consult with qualified healthcare professionals for medical decisions.

## Support

For technical support or medical content questions:
- Email: support@nelson-gpt.com
- Documentation: [docs.nelson-gpt.com](https://docs.nelson-gpt.com)
- Issues: [GitHub Issues](https://github.com/your-org/nelson-gpt/issues)

## Acknowledgments

- **Nelson Textbook of Pediatrics**: For providing the medical knowledge base
- **Mistral AI**: For natural language processing capabilities
- **Supabase**: For backend infrastructure
- **Open Source Community**: For the amazing tools and libraries

---

Built with ❤️ for pediatric healthcare professionals worldwide.