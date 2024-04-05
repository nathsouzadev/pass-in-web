import nlwIcon from '../assets/nlw-unite-icon.svg';
import { NavLink } from './nav-link';

export function Header() {
  return (
    <header className='flex items-center gap-5 py-2'>
      <img src={nlwIcon} />

      <nav className='flex items-center gap-5'>
        <NavLink>Eventos</NavLink>
        <NavLink>Participantes</NavLink>
      </nav>
    </header>
  );
}