export const pricingGroups = [
    {
        id: 'familia',
        title: 'Plan familiar',
        eyebrow: 'Familiar',
        description: 'Lectura guiada, practica con voz y actividades para que los ninos avancen en casa.',
        status: 'available',
        audience: 'Para practicar desde casa',
        highlight: 'PAGA COMO TRIMESTRAL Y USA TODO EL ANO',
        cta: 'Elegir Plan Familiar',
        benefits: [
            'Cuentos interactivos',
            'Practica con voz',
            'Actividades de aprender',
            'Favoritos y progreso',
        ],
        plans: [
            {
                id: 'mensual',
                name: 'Mensual',
                normalPrice: 9,
                offerPrice: 9,
                period: 'mes',
                description: 'Acceso mes a mes.',
                summary: 'Acceso mensual',
            },
            {
                id: 'trimestral',
                name: 'Trimestral',
                normalPrice: 29,
                offerPrice: 29,
                period: '3 meses',
                description: 'Una opcion practica para avanzar con calma.',
                summary: 'Para crear habito',
            },
            {
                id: 'anual',
                name: 'Anual',
                normalPrice: 39,
                offerPrice: 29,
                period: 'ano',
                badge: 'Oferta especial',
                description: 'Mejor valor para aprender todo el ano.',
                summary: 'Ahorra 10 Bs',
                featured: true,
            },
        ],
    },
    {
        id: 'profesor',
        title: 'Plan Profesor',
        eyebrow: 'Profesor',
        description: 'Para docentes y aulas.',
        status: 'available',
        audience: 'Para docentes y aulas',
        highlight: 'PAGA COMO TRIMESTRAL Y USA TODO EL ANO',
        cta: 'Elegir Plan Profesor',
        benefits: [
            '1 cuenta docente',
            'Hasta 20 estudiantes',
            'Hasta 3 cursos',
            'Cuentas individuales para estudiantes',
            'Asignacion de cuentos como tareas digitales',
            'Seguimiento del progreso por alumno',
            'Panel de notas automatico',
            'Login masivo para estudiantes',
        ],
        plans: [
            {
                id: 'profesor-mensual',
                name: 'Mensual',
                normalPrice: 29,
                offerPrice: 29,
                period: 'mes',
            },
            {
                id: 'profesor-trimestral',
                name: 'Trimestral',
                normalPrice: 79,
                offerPrice: 79,
                period: '3 meses',
            },
            {
                id: 'profesor-anual',
                name: 'Anual',
                normalPrice: 99,
                offerPrice: 79,
                period: 'ano',
                featured: true,
            },
        ],
    },
    {
        id: 'institucion',
        title: 'Plan Institucional',
        eyebrow: 'Institucional',
        description: 'Para colegios, centros y academias.',
        status: 'available',
        audience: 'Para colegios, centros y academias',
        highlight: 'IDEAL PARA CENTROS EDUCATIVOS',
        cta: 'Solicitar Plan Institucional',
        benefits: [
            'Hasta 5 cuentas docentes',
            'Hasta 150 estudiantes',
            'Gestion de cursos por docente',
            'Cuentas individuales para estudiantes',
            'Tareas digitales por curso',
            'Seguimiento del progreso institucional',
            'Panel de notas por docente y curso',
            'Reportes para direccion o administracion',
            'Soporte prioritario',
        ],
        plans: [
            {
                id: 'institucion-mensual',
                name: 'Mensual',
                normalPrice: 99,
                offerPrice: 99,
                period: 'mes',
            },
            {
                id: 'institucion-trimestral',
                name: 'Trimestral',
                normalPrice: 249,
                offerPrice: 249,
                period: '3 meses',
            },
            {
                id: 'institucion-anual',
                name: 'Anual',
                normalPrice: 349,
                offerPrice: 249,
                period: 'ano',
                featured: true,
            },
        ],
    },
]

export function getPricingSelection(planId) {
    for (const group of pricingGroups) {
        const plan = group.plans.find((item) => item.id === planId)

        if (plan) {
            return { group, plan }
        }
    }

    const fallbackGroup = pricingGroups[0]
    const fallbackPlan = fallbackGroup.plans.find((plan) => plan.featured) || fallbackGroup.plans[0]
    return { group: fallbackGroup, plan: fallbackPlan }
}
