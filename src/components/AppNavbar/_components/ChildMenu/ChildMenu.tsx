import React from "react";

import { Text } from "@mantine/core";

import classNames from "./childMenu.module.css";
import { MenuItem } from "../../_data/allMenu";

interface Props {
	item: NonNullable<MenuItem["children"]>[number];
}

/**
 * `ChildMenu` is a React functional component that renders a child menu item.
 * It displays the item as a text link.
 *
 * @param props - The component props.
 * @param props.item - The child menu item data.
 * @returns A React element representing a child menu item.
 */
export default function ChildMenu(props: Props) {

	const linkPath = props.item.link.startsWith('/') ? props.item.link : `/${props.item.link}`;

	return (
		<Text<"a">
			component="a"
			className={classNames.link}
			href={`/dashboard${linkPath}`}
		>
            {props.item.label}
        </Text>
	);
}
