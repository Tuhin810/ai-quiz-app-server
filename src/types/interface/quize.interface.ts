export interface IQuiz {
	title: string;
	description?: string;
	created_by: any; // user id reference
	tags?: string[]; // optional
	is_active?: boolean; // default true
}
