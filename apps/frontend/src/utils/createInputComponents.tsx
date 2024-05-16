import {
	MultiSelect,
	MultiSelectProps,
	NumberInput,
	NumberInputProps,
	PasswordInput,
	PasswordInputProps,
	TextInput,
	TextInputProps,
} from "@mantine/core";
import { ReactNode } from "@tanstack/react-router";

type GeneralInputProps = {
	hidden?: boolean;
};

type TextInputType = {
	type: "text";
} & TextInputProps;

type MultiSelectInputType = {
	type: "multi-select";
} & MultiSelectProps;

type PasswordInputType = {
	type: "password";
} & PasswordInputProps;

type NumberInputType = {
	type: "number";
} & Omit<NumberInputProps, "type">;

interface Options {
	disableAll?: boolean;
	readonlyAll?: boolean;
	inputs: ((
		| TextInputType
		| MultiSelectInputType
		| PasswordInputType
		| NumberInputType
	) &
		GeneralInputProps)[];
}

function createInputComponents(options: Options) {
	const components = [] as ReactNode[];

	for (const input of options.inputs) {
		if (input.hidden) continue;

		switch (input.type) {
			case "text":
				components.push(
					<TextInput
						{...input}
						readOnly={options.readonlyAll || input.readOnly}
						disabled={options.disableAll || input.disabled}
					/>
				);
				break;
			case "multi-select":
				components.push(
					<MultiSelect
						{...input}
						readOnly={options.readonlyAll || input.readOnly}
						disabled={options.disableAll || input.disabled}
					/>
				);
				break;
			case "password":
				components.push(
					<PasswordInput
						{...input}
						readOnly={options.readonlyAll || input.readOnly}
						disabled={options.disableAll || input.disabled}
					/>
				);
				break;
			case "number":
				components.push(
					<NumberInput
						{...input}
						type="text"
						readOnly={options.readonlyAll || input.readOnly}
						disabled={options.disableAll || input.disabled}
					/>
				);
				break;
		}
	}
}

export default createInputComponents;
