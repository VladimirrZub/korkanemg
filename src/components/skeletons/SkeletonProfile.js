import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
	max-width: 800px;
	margin: 120px auto 60px;
	padding: 0 2rem;
`

const ProfileHeader = styled.div`
	text-align: center;
	margin-bottom: 3rem;
`

const ProfileTitle = styled.div`
	height: 50px;
	width: 300px;
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

const ProfileCard = styled.div`
	background: rgba(26, 26, 26, 0.5);
	border: 1px solid rgba(99, 102, 241, 0.1);
	border-radius: 20px;
	padding: 2rem;
	backdrop-filter: blur(10px);
`

const AvatarSection = styled.div`
	display: flex;
	align-items: center;
	gap: 2rem;
	margin-bottom: 2rem;
	padding-bottom: 2rem;
	border-bottom: 1px solid rgba(99, 102, 241, 0.1);
`

const Avatar = styled.div`
	width: 100px;
	height: 100px;
	border-radius: 50%;
	background: ${props => props.theme.colors.background.secondary};
	animation: pulse 1.5s ease-in-out infinite;
`

const AvatarInfo = styled.div`
	flex: 1;
`

const AvatarName = styled.div`
	height: 28px;
	width: 200px;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 8px;
	margin-bottom: 0.5rem;
	animation: pulse 1.5s ease-in-out infinite;
	animation-delay: 0.1s;
`

const AvatarEmail = styled.div`
	height: 20px;
	width: 250px;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 6px;
	animation: pulse 1.5s ease-in-out infinite;
	animation-delay: 0.2s;
`

const FormGroup = styled.div`
	margin-bottom: 1.5rem;
`

const Label = styled.div`
	height: 20px;
	width: 120px;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 6px;
	margin-bottom: 0.5rem;
	animation: pulse 1.5s ease-in-out infinite;
	animation-delay: ${props => props.delay || '0s'};
`

const Input = styled.div`
	height: 48px;
	width: 100%;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 10px;
	animation: pulse 1.5s ease-in-out infinite;
	animation-delay: ${props => props.delay || '0s'};
`

const Button = styled.div`
	height: 52px;
	width: 200px;
	background: ${props => props.theme.colors.background.secondary};
	border-radius: 10px;
	animation: pulse 1.5s ease-in-out infinite;
	animation-delay: 0.5s;
`

const SkeletonProfile = () => {
	return (
		<Container>
			<ProfileHeader>
				<ProfileTitle />
			</ProfileHeader>

			<ProfileCard>
				<AvatarSection>
					<Avatar />
					<AvatarInfo>
						<AvatarName />
						<AvatarEmail />
					</AvatarInfo>
				</AvatarSection>

				<form>
					<FormGroup>
						<Label />
						<Input />
					</FormGroup>

					<FormGroup>
						<Label delay='0.1s' />
						<Input delay='0.1s' />
					</FormGroup>

					<FormGroup>
						<Label delay='0.2s' />
						<Input delay='0.2s' />
					</FormGroup>

					<Button />
				</form>
			</ProfileCard>
		</Container>
	)
}

export default SkeletonProfile
