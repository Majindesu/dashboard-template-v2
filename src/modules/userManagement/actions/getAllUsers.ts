import db from "@/core/db";
import prisma from "@/db";
import checkPermission from "@/modules/dashboard/services/checkPermission";
import unauthorized from "@/modules/dashboard/utils/unauthorized";
import "server-only";

const getAllUsers = async () => {
	if (!(await checkPermission("users.readAll"))) unauthorized();

	try {
		const users = await db.user.findMany({
			select: {
				id: true,
				email: true,
				photoProfile: true,
				name: true,
				roles: {
					select: {
						name: true,
						code: true,
					},
				},
			},
		});

		const result = users.map((user) => ({
			...user,
			photoUrl: user.photoProfile ?? null,
			photoProfile: undefined,
		}));

		return result;
	} catch (e) {
		throw e;
	}
};

export default getAllUsers;
