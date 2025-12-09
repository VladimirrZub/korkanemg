import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
	max-width: 1200px;
	margin: 120px auto 60px;
	padding: 0 2rem;
`

const DashboardHeader = styled.div`
	text-align: center;
	margin-bottom: 3rem;
`

const WelcomeText = styled.div`
	height: 60px;
	width: 400px;
	max-width: 100%;
	margin: 0 auto 1rem;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 12px;
	animation: pulse 1.5s ease-in-out infinite;

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
`

const Subtitle = styled.div`
	height: 24px;
	width: 300px;
	max-width: 100%;
	margin: 0 auto;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 8px;
	animation: pulse 1.5s ease-in-out infinite;
	animation-delay: 0.2s;
`

const DashboardGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
	gap: 2rem;
	margin-bottom: 3rem;
`

const StatsCard = styled.div`
	background: rgba(26, 26, 26, 0.5);
	border: 1px solid rgba(99, 102, 241, 0.1);
	border-radius: 20px;
	padding: 2rem;
	backdrop-filter: blur(10px);
`

const StatsValue = styled.div`
	height: 60px;
	width: 120px;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 12px;
	margin-bottom: 1rem;
	animation: pulse 1.5s ease-in-out infinite;
`

const StatsLabel = styled.div`
	height: 24px;
	width: 150px;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 8px;
	animation: pulse 1.5s ease-in-out infinite;
	animation-delay: 0.3s;
`

const SectionTitle = styled.div`
	height: 40px;
	width: 200px;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 10px;
	margin-bottom: 2rem;
	animation: pulse 1.5s ease-in-out infinite;
	animation-delay: 0.4s;
`

const CoursesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 2rem;
`

const CourseCard = styled.div`
	background: rgba(26, 26, 26, 0.5);
	border: 1px solid rgba(99, 102, 241, 0.1);
	border-radius: 20px;
	overflow: hidden;
`

const CourseImage = styled.div`
	height: 200px;
	background: ${props => props.theme.colors.background.secondary};
	animation: pulse 1.5s ease-in-out infinite;
`

const CourseContent = styled.div`
	padding: 1.5rem;
`

const CourseTitle = styled.div`
	height: 28px;
	width: 80%;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 8px;
	margin-bottom: 1rem;
	animation: pulse 1.5s ease-in-out infinite;
	animation-delay: 0.1s;
`

const CourseDescription = styled.div`
	height: 16px;
	width: 90%;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 6px;
	margin-bottom: 1rem;
	animation: pulse 1.5s ease-in-out infinite;
	animation-delay: 0.2s;
`

const ProgressBar = styled.div`
	height: 8px;
	width: 100%;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 4px;
	margin-bottom: 0.5rem;
	animation: pulse 1.5s ease-in-out infinite;
	animation-delay: 0.3s;
`

const ProgressText = styled.div`
	height: 16px;
	width: 120px;
	margin-left: auto;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 6px;
	animation: pulse 1.5s ease-in-out infinite;
	animation-delay: 0.4s;
`

const ActionButton = styled.div`
	height: 48px;
	width: 100%;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 12px;
	margin-top: 1rem;
	animation: pulse 1.5s ease-in-out infinite;
	animation-delay: 0.5s;
`

const DashboardActions = styled.div`
	display: flex;
	gap: 1rem;
	margin: 2rem 0 3rem;
	justify-content: center;
`

const ActionCard = styled.div`
	flex: 1;
	max-width: 200px;
	height: 100px;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 15px;
	animation: pulse 1.5s ease-in-out infinite;
	animation-delay: ${props => props.delay || '0s'};
`

const SkeletonDashboard = () => {
	return (
		<Container>
			<DashboardHeader>
				<WelcomeText />
				<Subtitle />
			</DashboardHeader>

			<DashboardGrid>
				<StatsCard>
					<StatsValue />
					<StatsLabel />
				</StatsCard>

				<StatsCard>
					<StatsValue />
					<StatsLabel />
				</StatsCard>

				<StatsCard>
					<StatsValue />
					<StatsLabel />
				</StatsCard>
			</DashboardGrid>

			<DashboardActions>
				<ActionCard delay='0.1s' />
				<ActionCard delay='0.2s' />
			</DashboardActions>

			<SectionTitle />

			<CoursesGrid>
				{[1, 2, 3].map(item => (
					<CourseCard key={item}>
						<CourseImage />
						<CourseContent>
							<CourseTitle />
							<CourseDescription />
							<CourseDescription style={{ width: '70%' }} />
							<ProgressBar />
							<ProgressText />
							<ActionButton />
						</CourseContent>
					</CourseCard>
				))}
			</CoursesGrid>
		</Container>
	)
}

export default SkeletonDashboard
