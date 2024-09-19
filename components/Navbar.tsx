import NavbarLinksDropdown from './NavbarLinksDropdown';
import NavbarLinks from './NavbarLinks';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {

  return (
    <nav className='bg-muted py-4 sm:px-16 lg:px-24 px-4 flex items-center justify-between'>
      <div className='flex items-center gap-x-4'>
        <NavbarLinksDropdown />
        <div className='text-xl font-bold'>GitConnect</div>
      </div>
      <div className='flex items-center gap-x-4'>
        <NavbarLinks />
        <ThemeToggle />
      </div>
    </nav>
  );
}
export default Navbar;