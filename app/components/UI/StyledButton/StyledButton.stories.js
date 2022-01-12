import React from 'react';
import { action } from '@storybook/addon-actions';
import { text, boolean, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import StyledButton from '.';

storiesOf('UI / StyledButton', module)
	.addDecorator((getStory) => getStory())
	.add('Default', () => (
		<StyledButton
			type={select(
				'type',
				{
					orange: 'orange',
					blue: 'blue',
					confirm: 'confirm',
					normal: 'normal',
					'rounded-normal': 'rounded-normal',
					cancel: 'cancel',
					signingCancel: 'signingCancel',
					transparent: 'transparent',
					'transparent-blue': 'transparent-blue',
					warning: 'warning',
					'warning-empty': 'warning-empty',
					info: 'info',
					neutral: 'neutral',
					danger: 'danger',
					sign: 'sign',
					view: 'view',
				},
				'confirm'
			)}
			onPress={action('onPress')}
			disabled={boolean('disabled', false)}
			onPressOut={action('onPressOut')}
		>
			{text('children', 'Confirm')}
		</StyledButton>
	));
