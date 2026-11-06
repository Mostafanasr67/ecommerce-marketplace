import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Category = {
	id: string;
	name: string;
};

interface CategoriesProps {
	onCategorySelect: (categoryId: string) => void;
}

function Categories({ onCategorySelect }: CategoriesProps) {
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		fetch("http://localhost:5000/categories")
			.then((res) => res.json())
			.then((data) => {
				const categoryList = Array.isArray(data) ? data : data.categories || [];
				setCategories(categoryList);
			});
	}, []);

	return (
		<section
			id="category-section"
			className="mx-auto w-full max-w-7xl px-margin py-space-xl"
		>
			<div className="mb-space-lg flex items-end justify-between">
				<div>
					<p className="mb-space-xs text-label-sm font-bold uppercase tracking-wider text-primary">
						Explore the marketplace
					</p>

					<h2 className="text-headline-md font-bold text-on-surface">
						Shop by Category
					</h2>
				</div>

				<Link
					to="/home"
          onClick={(e)=>{
            e.preventDefault();
            onCategorySelect("");
          }}
					className="text-label-md font-semibold text-primary hover:underline"
				>
					View all →
				</Link>
			</div>

			<div className="grid grid-cols-2 gap-space-md sm:grid-cols-3 lg:grid-cols-6">
				{categories.map((category) => (
					<Link
						key={category.name}
						to="/home"
						onClick={(e) => {
							e.preventDefault();
							onCategorySelect(category.id);
						}}
						className="group overflow-hidden rounded-xl bg-surface-container-low transition-transform hover:-translate-y-1"
					>
						{/* <div className="aspect-square overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div> */}

						<h3 className="p-space-md text-center text-label-md font-bold text-on-surface">
							{category.name}
						</h3>
					</Link>
				))}
			</div>
		</section>
	);
}

export default Categories;
