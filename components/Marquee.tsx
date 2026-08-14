"use client";

const STACK = [
  "GitHub Actions", "Ansible", "Azure", "AWS", "Terraform", "Docker",
  "Datadog", "SQL Server", "Python", "Bash", "Jinja2", "Bicep",
  "Apache", "Solr", "Key Vault", "Service Bus", "AzCopy", "GitLab CI",
];

/* A single continuous ribbon of the stack. The list is rendered twice
   and the track translates exactly -50%, so the seam lands where the
   duplicate begins and the loop reads as endless. */
export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {STACK.map((s) => (
              <span className="marquee-item" key={s}>
                {s}
                <i className="marquee-dot" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
