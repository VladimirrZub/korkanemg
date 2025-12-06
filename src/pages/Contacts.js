import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;



const ContactsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  padding: 2rem;
  padding-top: 100px;

  @media (max-width: 968px) {
    padding-top: 80px;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  animation: ${slideUp} 0.8s ease-out;
  
  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 1.3rem;
    color: #a0a0a0;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const ContentGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ContactInfo = styled.div`
  animation: ${slideUp} 0.8s ease-out 0.2s both;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: white;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #6366F1, transparent);
  }
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  animation: ${slideUp} 0.8s ease-out ${props => props.delay || '0s'} both;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(99, 102, 241, 0.3);
  }
  
  .icon {
    font-size: 1.5rem;
    color: #6366F1;
    min-width: 40px;
  }
  
  .content {
    flex: 1;
    
    h3 {
      color: white;
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    p {
      color: #a0a0a0;
      margin-bottom: 0.25rem;
    }
    
    a {
      color: #6366F1;
      text-decoration: none;
      transition: color 0.3s ease;
      
      &:hover {
        color: #8B5CF6;
      }
    }
  }
`;

const ContactForm = styled.form`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${slideUp} 0.8s ease-out 0.4s both;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    color: white;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &::placeholder {
      color: #666;
    }
    
    &:focus {
      outline: none;
      border-color: #6366F1;
      background: rgba(255, 255, 255, 0.12);
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
    }
  }
  
  select {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366F1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1em;
    
    option {
      background: #1a1a1a;
      color: white;
      padding: 1rem;
      
      &:checked {
        background: #6366F1;
        color: white;
      }
      
      &:hover {
        background: #6366F1;
      }
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 120px;
    font-family: inherit;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10B981;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  margin-top: 1rem;
  animation: ${slideUp} 0.5s ease-out;
`;

const MapSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 4rem;
  animation: ${slideUp} 0.8s ease-out 0.6s both;
`;

const MapPlaceholder = styled.div`
  height: 400px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0a0a0;
  font-size: 1.2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .map-content {
    text-align: center;
    
    .icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }
  }
`;

const FAQSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  animation: ${slideUp} 0.8s ease-out 0.8s both;
`;

const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const FAQItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(99, 102, 241, 0.3);
  }
  
  h3 {
    color: white;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  p {
    color: #a0a0a0;
    line-height: 1.6;
  }
`;

const PhoneInput = ({ value, onChange, ...props }) => {
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    if (numbers.length <= 1) return `+7 (${numbers}`;
    if (numbers.length <= 4) return `+7 (${numbers.slice(1, 4)}`;
    if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}`;
    if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}`;
    return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    onChange({
      ...e,
      target: {
        ...e.target,
        value: formattedValue
      }
    });
  };

  return (
    <input
      type="tel"
      value={value}
      onChange={handleChange}
      placeholder="+7 (___) ___-__-__"
      {...props}
    />
  );
};

const CustomSelect = ({ value, onChange, children, ...props }) => {
  const handleChange = (e) => {
    onChange(e);
    e.target.blur();
  };

  return (
    <select value={value} onChange={handleChange} {...props}>
      {children}
    </select>
  );
};

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (e) => {
    setFormData({
      ...formData,
      phone: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const contactItems = [
    {
      icon: '',
      title: 'Телефон',
      content: ['1 (123) 555-55-55', 'Бесплатный звонок по России'],
      delay: '0s'
    },
    {
      icon: '',
      title: 'Email',
      content: [
        'info@korochki.est - общие вопросы',
        'support@korochki.est - техподдержка'
      ],
      delay: '0.1s'
    },
    {
      icon: '',
      title: 'Адрес',
      content: [
        'Великий Новгород',
        'Бизнес'
      ],
      delay: '0.2s'
    },
    {
      icon: '',
      title: 'Время работы',
      content: [
        'Пн-Пт: 9:00 - 18:00',
        'Сб-Вс: 10:00 - 16:00'
      ],
      delay: '0.3s'
    }
  ];

  const faqItems = [
  {
    question: 'Как записаться на курс?',
    answer: 'Выберите подходящий курс на странице "Курсы", нажмите "Записаться" и следуйте инструкциям для оформления заявки.'
  },
  {
    question: 'Какие документы я получу после обучения?',
    answer: 'После успешного окончания курса вы получите удостоверение или диплом установленного образца о дополнительном профессиональном образовании.'
  },
  {
    question: 'Можно ли оплатить курс в рассрочку?',
    answer: 'Да, мы предоставляем возможность оплаты в рассрочку на большинство курсов. Подробности уточняйте у наших менеджеров.'
  },
  {
    question: 'Есть ли возможность вернуть деньги?',
    answer: 'Да, мы предоставляем возврат средств в течение 14 дней после начала курса, если обучение не подошло.'
  },
  {
    question: 'Сколько длится обучение на курсах?',
    answer: 'Продолжительность обучения зависит от выбранного курса - от 1 до 6 месяцев. Каждый курс имеет четкий учебный план и график занятий.'
  },
  {
    question: 'Предоставляется ли доступ к материалам после окончания курса?',
    answer: 'Да, после завершения обучения у вас остается пожизненный доступ ко всем материалам курса, включая видеоуроки, презентации и дополнительные ресурсы.'
  }
];

  return (
    <ContactsContainer>
      <PageHeader>
        <h1>Свяжитесь с нами</h1>
        <p>Есть вопросы? Мы всегда рады помочь и ответить на все ваши вопросы</p>
      </PageHeader>

      <ContentGrid>
        <ContactInfo>
          <SectionTitle>Контактная информация</SectionTitle>
          <ContactList>
            {contactItems.map((item, index) => (
              <ContactItem key={index} delay={item.delay}>
                <div className="icon">{item.icon}</div>
                <div className="content">
                  <h3>{item.title}</h3>
                  {item.content.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </ContactItem>
            ))}
          </ContactList>
        </ContactInfo>

        <ContactForm onSubmit={handleSubmit}>
          <SectionTitle>Напишите нам</SectionTitle>
          
          <FormGroup>
            <label htmlFor="name">Имя *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ваше имя"
            />
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="phone">Телефон</label>
            <PhoneInput
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="+7 (___) ___-__-__"
            />
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="subject">Тема *</label>
            <CustomSelect
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Выберите тему</option>
              <option value="course">Вопрос по курсу</option>
              <option value="payment">Оплата и документы</option>
              <option value="technical">Техническая поддержка</option>
              <option value="other">Другое</option>
            </CustomSelect>
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="message">Сообщение *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Расскажите о вашем вопросе..."
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
          </SubmitButton>
          
          {isSubmitted && (
            <SuccessMessage>
              ✅ Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.
            </SuccessMessage>
          )}
        </ContactForm>
      </ContentGrid>

      <MapSection>
        <SectionTitle>Мы на карте</SectionTitle>
        <MapPlaceholder>
          <div className="map-content">
            <div>Интерактивная карта будет здесь</div>
          </div>
        </MapPlaceholder>
      </MapSection>

      <FAQSection>
        <SectionTitle>Частые вопросы</SectionTitle>
        <FAQGrid>
          {faqItems.map((item, index) => (
            <FAQItem key={index}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </FAQItem>
          ))}
        </FAQGrid>
      </FAQSection>
    </ContactsContainer>
  );
};

export default Contacts;