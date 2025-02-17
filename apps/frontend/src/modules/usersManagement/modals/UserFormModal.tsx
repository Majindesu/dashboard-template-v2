import stringToColorHex from "@/utils/stringToColorHex";
import {
	Avatar,
	Button,
	Center,
	Flex,
	Modal,
	ScrollArea,
	Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { createUser, updateUser } from "../queries/userQueries";
import { TbDeviceFloppy } from "react-icons/tb";
import client from "../../../honoClient";
import { getUserByIdQueryOptions } from "../queries/userQueries";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import FormResponseError from "@/errors/FormResponseError";
import createInputComponents from "@/utils/createInputComponents";

/**
 * Change this
 */
const routeApi = getRouteApi("/_dashboardLayout/users/");

export default function UserFormModal() {
	/**
	 * DON'T CHANGE FOLLOWING:
	 */
	const queryClient = useQueryClient();

	const navigate = routeApi.useNavigate();

	const searchParams = routeApi.useSearch();

	const dataId = searchParams.detail || searchParams.edit;

	const isModalOpen = Boolean(dataId || searchParams.create);

	const detailId = searchParams.detail;
	const editId = searchParams.edit;

	const formType = detailId ? "detail" : editId ? "edit" : "create";

	/**
	 * CHANGE FOLLOWING:
	 */

	const userQuery = useQuery(getUserByIdQueryOptions(dataId));

	const modalTitle =
		formType.charAt(0).toUpperCase() + formType.slice(1) + " User";

	const form = useForm({
		initialValues: {
			id: "",
			email: "",
			name: "",
			username: "",
			photoProfileUrl: "",
			password: "",
			roles: [] as string[],
		},
	});

	useEffect(() => {
		const data = userQuery.data;

		if (!data) {
			form.reset();
			return;
		}

		form.setValues({
			id: data.id,
			email: data.email ?? "",
			name: data.name,
			photoProfileUrl: "",
			username: data.username,
			password: "",
			roles: data.roles.map((v) => v.id), //only extract the id
		});

		form.setErrors({});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userQuery.data]);

	const mutation = useMutation({
		mutationKey: ["usersMutation"],
		mutationFn: async (
			options:
				| { action: "edit"; data: Parameters<typeof updateUser>[0] }
				| { action: "create"; data: Parameters<typeof createUser>[0] }
		) => {
			console.log("called");
			return options.action === "edit"
				? await updateUser(options.data)
				: await createUser(options.data);
		},
		onError: (error: unknown) => {
			console.log(error);

			if (error instanceof FormResponseError) {
				form.setErrors(error.formErrors);
				return;
			}

			if (error instanceof Error) {
				notifications.show({
					message: error.message,
					color: "red",
				});
			}
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		if (formType === "detail") return;

		//TODO: OPtimize this code
		if (formType === "create") {
			await mutation.mutateAsync({
				action: formType,
				data: {
					email: values.email,
					name: values.name,
					password: values.password,
					roles: JSON.stringify(values.roles),
					isEnabled: "true",
					username: values.username,
				},
			});
		} else {
			await mutation.mutateAsync({
				action: formType,
				data: {
					id: values.id,
					email: values.email,
					name: values.name,
					password: values.password,
					roles: JSON.stringify(values.roles),
					isEnabled: "true",
					username: values.username,
				},
			});
		}
		queryClient.invalidateQueries({ queryKey: ["users"] });
		notifications.show({
			message: `The ser is ${formType === "create" ? "created" : "edited"}`,
		});

		navigate({ search: {} });
	};

	/**
	 * YOU MIGHT NOT NEED FOLLOWING:
	 */
	const rolesQuery = useQuery({
		queryKey: ["roles"],
		queryFn: async () => {
			const res = await client.roles.$get();

			if (res.ok) {
				return await res.json();
			}

			throw new Error(await res.text());
		},
	});

	return (
		<Modal
			opened={isModalOpen}
			onClose={() => navigate({ search: {} })}
			title={modalTitle} //Uppercase first letter
			scrollAreaComponent={ScrollArea.Autosize}
			size="md"
		>
			<form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
				<Stack mt="sm" gap="lg" px="lg">
					{/* Avatar */}
					<Center>
						<Avatar
							color={stringToColorHex(form.values.id ?? "")}
							src={form.values.photoProfileUrl}
							size={120}
						>
							{form.values.name?.[0]?.toUpperCase()}
						</Avatar>
					</Center>
				</Stack>

				{createInputComponents({
					disableAll: mutation.isPending,
					readonlyAll: formType === "detail",
					inputs: [
						{
							type: "text",
							readOnly: true,
							variant: "filled",
							...form.getInputProps("id"),
							hidden: !form.values.id,
						},
						{
							type: "text",
							label: "Name",
							...form.getInputProps("name"),
						},
						{
							type: "text",
							label: "Username",
							...form.getInputProps("username"),
						},
						{
							type: "text",
							label: "Email",
							...form.getInputProps("email"),
						},
						{
							type: "password",
							label: "Password",
							hidden: formType !== "create",
							...form.getInputProps("password"),
						},
						{
							type: "multi-select",
							label: "Roles",
							value: form.values.roles,
							onChange: (values) =>
								form.setFieldValue("roles", values),
							data: rolesQuery.data?.map((role) => ({
								value: role.id,
								label: role.name,
							})),
							error: form.errors.roles,
						},
					],
				})}

				{/* Buttons */}
				<Flex justify="flex-end" align="center" gap="lg" mt="lg">
					<Button
						variant="outline"
						onClick={() => navigate({ search: {} })}
						disabled={mutation.isPending}
					>
						Close
					</Button>
					{formType !== "detail" && (
						<Button
							variant="filled"
							leftSection={<TbDeviceFloppy size={20} />}
							type="submit"
							loading={mutation.isPending}
						>
							Save
						</Button>
					)}
				</Flex>
			</form>
		</Modal>
	);
}
