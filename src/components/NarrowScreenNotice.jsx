import Icon from './Icon.jsx'
import '../styles/NarrowScreenNotice.css'

export default function NarrowScreenNotice() {
  return (
    <div className="narrow-notice">
      <div className="narrow-notice__card glass">
        <span className="narrow-notice__logo">
          <Icon name="crown" />
        </span>
        <h1 className="narrow-notice__title">Anı Defterim</h1>
        <p>Anı Defterim bilgisayar ekranı için tasarlandı. Lütfen bir bilgisayardan aç.</p>
      </div>
    </div>
  )
}
