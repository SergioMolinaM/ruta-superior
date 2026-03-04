import { MessageCircle, Send, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Radius, Shadow, Spacing } from '../constants/theme';
import type { UserProfile } from '../types';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}
interface RutaChatProps {
    profile?: UserProfile | null;
    fullScreen?: boolean;
}

export default function RutaChat({ profile, fullScreen = false }: RutaChatProps) {
    const [isOpen, setIsOpen] = useState(fullScreen);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const slideAnim = useRef(new Animated.Value(300)).current;
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            initChat();
        }

        Animated.spring(slideAnim, {
            toValue: isOpen ? 0 : 300,
            useNativeDriver: true,
            tension: 65,
            friction: 10,
        }).start();
    }, [isOpen]);

    const initChat = async () => {
        setIsTyping(true);
        let welcomeText = "¡Hola! soy Ruta 👋. Sé que este proceso puede ser estresante, pero te acompañaré desde el principio ¡No te preocupes! ";

        try {
            const response = await fetch('https://caminoalau-api.onrender.com/calendario');
            const eventos = await response.json();

            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            const proximoEvento = eventos.find((evt: any) => new Date(evt.s + 'T00:00:00') >= hoy);

            if (proximoEvento) {
                const fechaEvt = new Date(proximoEvento.s + 'T00:00:00');
                const diffDays = Math.ceil((fechaEvt.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

                if (diffDays === 0) {
                    welcomeText += `Hoy es un día clave: ${proximoEvento.titulo}. respira hondo, asegúrate de tener tus documentos a mano y cuéntame si necesitas ayuda con el paso a paso.`;
                } else if (diffDays <= 5) {
                    welcomeText += `Quedan solo ${diffDays} días para ${proximoEvento.titulo}. Es normal sentir algo de ansiedad; ¿quieres que revisemos juntos los requisitos para que vayas con tranquilidad?`;
                } else {
                    welcomeText += "¿Por dónde quieres empezar? Estoy aquí para orientarte sobre becas, gratuidad o comparar opciones.";
                }
            } else {
                welcomeText += "¿Por dónde quieres empezar? Estoy aquí para orientarte sobre becas, gratuidad o comparar opciones.";
            }
        } catch (error) {
            welcomeText += "Estoy lista para ayudarte con tus dudas sobre la universidad. ¿En qué puedo apoyarte hoy?";
            console.log('Error fetching calendario for RutaChat', error);
        }

        setMessages([{ id: Date.now().toString(), text: welcomeText, sender: 'bot' }]);
        setIsTyping(false);
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { id: Date.now().toString(), text: userMsg, sender: 'user' }]);
        setIsTyping(true);

        setTimeout(() => {
            let botResponse = "Entiendo perfectamente. ¿En qué más puedo orientarte o qué otra duda tienes en mente?";
            const lower = userMsg.toLowerCase();

            const rsh = profile ? parseInt(profile.rsh) || 100 : 100;
            const nem = profile?.nem || "0";
            const nombre = profile?.nombre || "estudiante";
            const lc = profile ? parseInt(profile.lc) || 0 : 0;
            const m1 = profile ? parseInt(profile.m1) || 0 : 0;
            const prom = (lc + m1) / 2;

            if (lower.includes('gratuidad') || lower.includes('gratis')) {
                if (profile && rsh <= 60) {
                    botResponse = `¡Buenas noticias, ${nombre}! Según tu Registro Social de Hogares (${rsh}%), **cumples el principal requisito socioeconómico** para optar a la Gratuidad. Recuerda que debes estudiar en una institución adscrita y llenar el FUAS.`;
                } else if (profile && rsh > 60) {
                    botResponse = `Hola ${nombre}. Tu RSH actual es de ${rsh}%, por lo que excedes el 60% requerido para la Gratuidad. ¡Pero no te desanimes! Aún puedes optar a la Beca Bicentenario o al CAE. ¿Quieres que hablemos de eso?`;
                } else {
                    botResponse = "Para optar a Gratuidad, necesitas estar dentro del 60% de menores ingresos en el RSH y llenar tu FUAS a tiempo.";
                }
            } else if (lower.includes('beca')) {
                if (profile && rsh <= 70) {
                    botResponse = `Por tu nivel socioeconómico (${rsh}%), calificas perfectamente para becas de arancel como la Beca Bicentenario o Juan Gómez Millas. Procura tener un buen puntaje PAES para asegurar tu cupo.`;
                } else {
                    botResponse = "Las becas Mineduc exigen llenar el FUAS. ¡Te recomiendo hacerlo incluso si crees que no calificas! Siempre hay opciones.";
                }
            } else if (lower.includes('paes') || lower.includes('puntaje')) {
                if (profile && prom > 0) {
                    botResponse = `Veo que tu promedio entre Competencia Lectora y Matemática 1 es de **${prom} puntos**. Con ese puntaje puedes usar nuestro Explorador de Carreras para ver opciones reales y comparar los aranceles.`;
                } else {
                    botResponse = "¡Concéntrate en dar tu mejor esfuerzo en la PAES! Recuerda que tu puntaje se pondera distinto según la carrera.";
                }
            } else if (lower.includes('nem') || lower.includes('ranking')) {
                botResponse = profile && nem !== "0"
                    ? `Tienes un NEM registrado de ${nem}. ¡Ese es tu piso de entrada! En carreras de alta demanda escolar, tu desempeño en la media vale oro.`
                    : "Tranquilo/a, el NEM y Ranking son solo formas de premiar tu esfuerzo durante la media. Reflejan tu constancia escolar. ¿Tienes claro cómo calcular el tuyo?";
            } else if (lower.includes('estrés') || lower.includes('ansiedad') || lower.includes('nervios')) {
                botResponse = "Es completamente humano sentirse así. Recuerda respirar, ir paso a paso y, si lo necesitas, en la sección de 'Red de Apoyo' puedes contactar a orientadores reales dispuestos a escucharte.";
            }

            setMessages(prev => [...prev, { id: Date.now().toString(), text: botResponse, sender: 'bot' }]);
            setIsTyping(false);
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 1200);
    };

    if (!isOpen && !fullScreen) {
        return (
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.8}
            >
                <MessageCircle color={Colors.white} size={28} />
            </TouchableOpacity>
        );
    }

    const containerStyle = fullScreen ? styles.fullScreenContainer : [styles.chatWindow, { transform: [{ translateY: slideAnim }] }];

    return (
        <Animated.View style={containerStyle as any}>
            <View style={styles.header}>
                <View style={styles.headerTitle}>
                    <View style={styles.avatar}>
                        <Text style={{ fontSize: 18 }}>🤖</Text>
                    </View>
                    <View>
                        <Text style={styles.headerName}>Ruta</Text>
                        <Text style={styles.headerStatus}>Tu orientadora virtual</Text>
                    </View>
                </View>
                {!fullScreen && (
                    <TouchableOpacity onPress={() => setIsOpen(false)}>
                        <X color={Colors.white} size={24} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={{ padding: Spacing.md, gap: Spacing.sm }}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map(msg => (
                    <View key={msg.id} style={[styles.bubbleWrap, msg.sender === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                        <Text style={[styles.bubbleText, msg.sender === 'user' && { color: Colors.white }]}>
                            {msg.text}
                        </Text>
                    </View>
                ))}
                {isTyping && (
                    <View style={[styles.bubbleWrap, styles.bubbleBot, { width: 60, alignItems: 'center' }]}>
                        <ActivityIndicator size="small" color={Colors.navy} />
                    </View>
                )}
            </ScrollView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe tu pregunta..."
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={handleSend}
                        placeholderTextColor={Colors.neutral500}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, !input.trim() && { backgroundColor: Colors.neutral300 }]}
                        onPress={handleSend}
                        disabled={!input.trim()}
                    >
                        <Send color={Colors.white} size={18} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 80, // Above NavBar
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadow.card,
        shadowOpacity: 0.3,
        elevation: 6,
        zIndex: 100,
    },
    chatWindow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '75%',
        backgroundColor: Colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        ...Shadow.card,
        shadowOpacity: 0.2,
        elevation: 10,
        zIndex: 100,
    },
    fullScreenContainer: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        backgroundColor: Colors.primaryDark,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerName: {
        color: Colors.white,
        fontWeight: '700',
        fontSize: 16,
    },
    headerStatus: {
        color: Colors.primaryLight,
        fontSize: 12,
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    bubbleWrap: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
    },
    bubbleUser: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.primary,
        borderBottomRightRadius: 4,
    },
    bubbleBot: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.white,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: Colors.neutral300,
    },
    bubbleText: {
        fontSize: 14,
        color: Colors.navy,
        lineHeight: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: Spacing.md,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderColor: Colors.neutral300,
        paddingBottom: Platform.OS === 'ios' ? 30 : Spacing.md,
    },
    input: {
        flex: 1,
        backgroundColor: Colors.neutral100,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.md,
        height: 44,
        marginRight: Spacing.sm,
        color: Colors.navy,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
