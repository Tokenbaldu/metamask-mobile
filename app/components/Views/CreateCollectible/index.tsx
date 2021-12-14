import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TextInput, Platform } from 'react-native';
import { getNetworkNavbarOptions } from '../../../components/UI/Navbar';
import { colors, fontStyles } from '../../../styles/common';
import Text from '../../Base/Text';
import MediaSelector from '../../../components/UI/MediaSelector';
import ActionView from '../../../components/UI/ActionView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { strings } from '../../../../locales/i18n';

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: colors.white,
		flex: 1,
		padding: 20,
	},
	textInput: {
		borderWidth: 1,
		borderRadius: 4,
		borderColor: colors.grey100,
		padding: 16,
		marginTop: 8,
		marginBottom: 20,
		...fontStyles.normal,
	},
	description: {
		minHeight: 90,
		paddingTop: 16,
	},
	traitKey: {
		flex: 1,
		marginRight: 6,
	},
	traitValue: {
		flex: 1,
	},
	traitsRow: {
		flexDirection: 'row',
	},
	container: {
		marginBottom: 50,
	},
});

const CreateCollectible = () => {
	const [media, setMedia] = useState('');
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [traits, setTraits] = useState([{ trait_type: '', value: '' }]);

	const addTrait = useCallback(() => {
		const newTraits = [...traits, { trait_type: '', value: '' }];
		setTraits(newTraits);
	}, [traits]);

	const changeTraitValue = useCallback(
		(index, value) => {
			const newTraits = [...traits];
			newTraits[index].value = value;
			setTraits(newTraits);
		},
		[traits]
	);

	const changeTraitType = useCallback(
		(index, value) => {
			const newTraits = [...traits];
			newTraits[index].trait_type = value;
			setTraits(newTraits);
		},
		[traits]
	);

	const setMediaToSend = useCallback((mediaToSend) => {
		setMedia(mediaToSend);
	}, []);

	const handleSubmit = useCallback(async () => {
		const formData = new FormData();

		const params = {
			name: media.fileName || 'nft',
			type: media.type,
			uri: Platform.OS === 'ios' ? media.uri.replace('file://', '') : media.uri,
		};
		// eslint-disable-next-line no-console
		console.log('params', params);
		formData.append('file', params);

		const ipfsAddMediaResponse = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
			method: 'POST',
			body: formData,
		});
		const ipfsAddMediaResponseJson = await ipfsAddMediaResponse.json();

		// eslint-disable-next-line no-console
		console.log(ipfsAddMediaResponseJson);

		const metadata = { name, description, image: `ipfs://${ipfsAddMediaResponseJson.Hash}` };
		// eslint-disable-next-line no-console
		console.log('metadata', metadata, JSON.stringify(metadata));

		try {
			const formDataMetadata = new FormData();
			formDataMetadata.append('file', JSON.stringify(metadata));
			const ipfsAddMetadataResponse = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
				method: 'POST',
				body: formDataMetadata,
			});
			const ipfsAddMetadataResponseJson = await ipfsAddMetadataResponse.json();

			// eslint-disable-next-line no-console
			console.log(ipfsAddMetadataResponseJson);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log('ERROR', e);
		}
	}, [description, media, name]);

	return (
		<ActionView
			style={styles.wrapper}
			cancelTestID={'create-custom-asset-cancel-button'}
			confirmTestID={'creaate-custom-asset-confirm-button'}
			confirmText={strings('wallet.button_continue')}
			onConfirmPress={handleSubmit}
			showCancelButton={false}
			confirmDisabled={!name}
			confirmButtonMode={'sign'}
		>
			<View style={styles.container}>
				<MediaSelector setMediaToSend={setMediaToSend} />
				<Text bold>{`${strings('wallet.name')}*`}</Text>
				<TextInput
					style={styles.textInput}
					placeholder={strings('wallet.name_nft')}
					placeholderTextColor={colors.grey100}
					value={name}
					onChangeText={(value) => setName(value)}
				/>
				<Text bold>{strings('wallet.description')}</Text>
				<TextInput
					style={[styles.textInput, styles.description]}
					placeholder={strings('wallet.enter_description')}
					placeholderTextColor={colors.grey100}
					value={description}
					onChangeText={(value) => setDescription(value)}
					multiline
					numberOfLines={3}
				/>
				<Text bold>{strings('wallet.attributes')}</Text>
				{traits.map((trait, index) => (
					<View style={styles.traitsRow} key={index}>
						<TextInput
							style={[styles.textInput, styles.traitKey]}
							placeholder={strings('wallet.type')}
							placeholderTextColor={colors.grey100}
							value={trait.trait_type}
							onChangeText={(value) => changeTraitType(index, value)}
						/>
						<TextInput
							style={[styles.textInput, styles.traitValue]}
							placeholder={strings('wallet.value')}
							placeholderTextColor={colors.grey100}
							value={trait.value}
							onChangeText={(value) => changeTraitValue(index, value)}
						/>
					</View>
				))}
				<TouchableOpacity onPress={addTrait}>
					<Text blue>{`+ ${strings('wallet.add_attribute')}`}</Text>
				</TouchableOpacity>
			</View>
		</ActionView>
	);
};

CreateCollectible.navigationOptions = ({ navigation }) =>
	getNetworkNavbarOptions(`add_asset.create_nft`, true, navigation);

export default CreateCollectible;
